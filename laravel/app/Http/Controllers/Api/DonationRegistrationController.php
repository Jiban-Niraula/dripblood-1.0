<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonationRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\DonationRegistrationResource;

class DonationRegistrationController extends Controller
{
    /**
     * 🔐 Check admin
     */
    private function isAdmin()
    {
        return Auth::user() && Auth::user()->isAdmin();
    }

    /**
     * 📋 LIST REGISTRATIONS
     */
    public function index(Request $request)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $registrations = DonationRegistration::with(['user', 'bloodDonationEvent'])
            ->when($request->event_id, fn($q) =>
                $q->where('blood_donation_event_id', $request->event_id)
            )
            ->when($request->user_id, fn($q) =>
                $q->where('user_id', $request->user_id)
            )
            ->when($request->status, fn($q) =>
                $q->where('status', $request->status)
            )
            ->latest()
            ->paginate(10);

        return DonationRegistrationResource::collection($registrations);
    }

    /**
     * ➕ CREATE REGISTRATION
     */
    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'blood_donation_event_id' => 'required|exists:blood_donation_events,id',
            'notes' => 'nullable|string',
        ]);

        // 🚫 prevent duplicate registration (optimized)
        $exists = DonationRegistration::where('user_id', $validated['user_id'])
            ->where('blood_donation_event_id', $validated['blood_donation_event_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'User already registered for this event'
            ], 422);
        }

        $registration = DonationRegistration::create([
            ...$validated,
            'registered_at' => now(),
            'status' => 'registered',
        ]);

        return (new DonationRegistrationResource(
            $registration->load(['user', 'bloodDonationEvent'])
        ))->response()->setStatusCode(201);
    }

    /**
     * 👁 SHOW SINGLE REGISTRATION
     */
    public function show(DonationRegistration $donationRegistration)
    {
        $user = Auth::user();

        if (!$user->isAdmin() && $user->id !== $donationRegistration->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new DonationRegistrationResource(
            $donationRegistration->load(['user', 'bloodDonationEvent'])
        );
    }

    /**
     * ✏️ UPDATE REGISTRATION
     */
    public function update(Request $request, DonationRegistration $donationRegistration)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:registered,donated,cancelled',
            'donation_time' => 'nullable|date',
            'blood_type_donated' => 'nullable|string|max:10',
            'units_donated' => 'nullable|numeric|min:0|max:10',
            'notes' => 'nullable|string',
            'result' => 'nullable|string',
        ]);

        $donationRegistration->update($validated);

        return new DonationRegistrationResource(
            $donationRegistration->load(['user', 'bloodDonationEvent'])
        );
    }

    /**
     * ❌ DELETE REGISTRATION
     */
    public function destroy(DonationRegistration $donationRegistration)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $donationRegistration->delete();

        return response()->json([
            'message' => 'Registration deleted successfully'
        ]);
    }
}