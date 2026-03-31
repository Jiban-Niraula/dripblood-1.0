<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    // ---------------- USER LOGIN ----------------
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email_or_phone' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email_or_phone)
            ->orWhere('phone', $request->email_or_phone)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Account is ' . $user->status
            ], 403);
        }

        // 🔥 No Sanctum requested: send a dummy token for frontend compatibility
        $token = 'dummy-token-no-sanctum';

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'token_type' => 'Bearer',

            // 🔥 IMPORTANT: consistent user structure
            'user' => [
                'id' => $user->id,
                'uid' => $user->uid,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'blood_type' => $user->blood_type,
                'profile_image' => $user->profile_image ? (str_starts_with($user->profile_image, 'uploads/') ? asset($user->profile_image) : asset('storage/' . $user->profile_image)) : null,
            ],
        ], 200);
    }

    // ---------------- ADMIN LOGIN ----------------
    public function adminLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->login)
            ->orWhere('phone', $request->login)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid login credentials'
            ], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You do not have admin access'
            ], 403);
        }

        // No Sanctum requested
        $token = 'dummy-admin-token-no-sanctum';

        return response()->json([
            'success' => true,
            'message' => 'Admin login successful',
            'token' => $token,
            'token_type' => 'Bearer',

            'user' => [
                'id' => $user->id,
                'uid' => $user->uid,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'profile_image' => $user->profile_image ? (str_starts_with($user->profile_image, 'uploads/') ? asset($user->profile_image) : asset('storage/' . $user->profile_image)) : null,
            ],
        ], 200);
    }

    // ---------------- LOGOUT ----------------
    public function logout(Request $request)
    {
        // No Sanctum: skip token deletion

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}