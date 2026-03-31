<?php

namespace App\Http\Controllers;

use App\Models\BloodDonationEvent;
use App\Http\Resources\BloodDonationEventResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BloodDonationEventController extends Controller
{
    /**
     * LIST CAMPS
     */
    public function index(Request $request)
    {
        $cacheKey = 'blood_camps_' . md5(json_encode($request->all()));

        $camps = Cache::remember($cacheKey, 60, function () use ($request) {
            $query = BloodDonationEvent::with('creator');

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('camp_name', 'like', "%{$search}%")
                        ->orWhere('organized_by', 'like', "%{$search}%")
                        ->orWhere('camp_code', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            }

            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            return $query->latest()->get();
        });

        return response()->json([
            'success' => true,
            'data' => BloodDonationEventResource::collection($camps)
        ]);
    }

    /**
     * SHOW SINGLE CAMP
     */
    public function show(BloodDonationEvent $bloodDonationEvent)
    {
        $bloodDonationEvent->load('creator');

        return response()->json([
            'success' => true,
            'data' => new BloodDonationEventResource($bloodDonationEvent)
        ]);
    }

    /**
     * STORE CAMP
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'camp_name'            => 'required|min:3',
            'organized_by'         => 'required|min:3',
            'supporting_hospital'  => 'required',
            'location'             => 'required',
            'camp_type'            => ['required', Rule::in(['single', 'multiple'])],
            'start_date'           => 'required|date',
            'end_date'             => 'nullable|date|after_or_equal:start_date',
            'start_time'           => 'required',
            'end_time'             => 'required',
            'coordinator_name'     => 'required|min:2',
            'coordinator_contact'  => 'required|regex:/^[0-9]{10,}$/',
            'coordinator_email'    => 'nullable|email',
            'expected_donors'      => 'nullable|integer',
            'description'          => 'nullable|string',
            'status'               => ['nullable', Rule::in(['Scheduled','In Progress','Completed','Cancelled'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        $data['camp_code']     = 'BDC-' . date('Y') . '-' . strtoupper(Str::random(4));
        $data['actual_donors'] = 0;
        $data['status']        = $data['status'] ?? 'Scheduled';
        $data['created_by']    = Auth::id();

        $camp = BloodDonationEvent::create($data);

        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Camp created successfully',
            'data' => new BloodDonationEventResource($camp)
        ], 201);
    }

    /**
     * UPDATE CAMP
     */
    public function update(Request $request, BloodDonationEvent $bloodDonationEvent)
    {
        $validator = Validator::make($request->all(), [
            'camp_name'            => 'required|min:3',
            'organized_by'         => 'required|min:3',
            'supporting_hospital'  => 'required',
            'location'             => 'required',
            'camp_type'            => ['required', Rule::in(['single', 'multiple'])],
            'start_date'           => 'required|date',
            'end_date'             => 'nullable|date|after_or_equal:start_date',
            'start_time'           => 'required',
            'end_time'             => 'required',
            'coordinator_name'     => 'required|min:2',
            'coordinator_contact'  => 'required|regex:/^[0-9]{10,}$/',
            'coordinator_email'    => 'nullable|email',
            'expected_donors'      => 'nullable|integer',
            'actual_donors'        => 'nullable|integer',
            'description'          => 'nullable|string',
            'status'               => ['nullable', Rule::in(['Scheduled','In Progress','Completed','Cancelled'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['updated_by'] = Auth::id();

        $bloodDonationEvent->update($data);

        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Camp updated successfully',
            'data' => new BloodDonationEventResource($bloodDonationEvent)
        ]);
    }

    /**
     * DELETE CAMP
     */
    public function destroy(BloodDonationEvent $bloodDonationEvent)
    {
        $bloodDonationEvent->delete();

        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Camp deleted successfully'
        ]);
    }
}