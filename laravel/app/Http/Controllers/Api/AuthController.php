<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    // ---------------- Register Step 1: Save personal info + OTP ----------------
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'address' => 'required|string',
                'blood_group' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if email/phone already exists
            if (User::where('email', $request->email)->exists() || User::where('phone', $request->phone)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email or Phone already registered'
                ], 409);
            }

            // Generate OTP
            $otp = rand(1000, 9999);

            // Save data temporarily in cache for 10 minutes
            $cacheKey = "register_{$request->phone}";
            Cache::put($cacheKey, [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'blood_group' => $request->blood_group,
                'otp' => $otp,
                'otp_created_at' => now()->timestamp, // store as timestamp
            ], now()->addMinutes(10));

            // Log OTP
            Log::channel('otp')->info("OTP for {$request->phone} is: $otp");

            return response()->json([
                'success' => true,
                'message' => 'OTP sent to phone. Please verify and set password to complete registration.',
                'cache_key' => $cacheKey,
                'otp' => $otp // For testing only
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Register Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong on server.'
            ], 500);
        }
    }

    // ---------------- Complete Registration: Verify OTP + Set Password ----------------
    public function completeRegistration(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cache_key' => 'required|string',
                'otp' => 'required|digits:4',
                'password' => 'required|min:6|confirmed', // requires password_confirmation
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $cachedData = Cache::get($request->cache_key);

            if (!$cachedData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration data expired. Please register again.'
                ], 400);
            }

            // Check OTP
            if ($cachedData['otp'] != $request->otp) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid OTP'
                ], 400);
            }

            // Check OTP age (5 minutes)
            $otpAge = (now()->timestamp - intval($cachedData['otp_created_at'])) / 60;
            if ($otpAge > 5) {
                return response()->json([
                    'success' => false,
                    'message' => 'OTP expired'
                ], 400);
            }

            // Save user to database
            $user = User::create([
                'name' => $cachedData['name'],
                'email' => $cachedData['email'],
                'phone' => $cachedData['phone'],
                'address' => $cachedData['address'],
                'blood_group' => $cachedData['blood_group'],
                'password' => Hash::make($request->password),
            ]);

            // Remove cache
            Cache::forget($request->cache_key);

            return response()->json([
                'success' => true,
                'message' => 'Registration completed successfully',
                'user_id' => $user->id
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Complete Registration Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong on server.'
            ], 500);
        }
    }

    // ---------------- Login ----------------
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email_or_phone' => 'required',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
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

            // Generate Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
        } catch (\Throwable $e) {
            Log::error('Login Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong on server.'
            ], 500);
        }
    }

    public function adminLogin(Request $request)
    {
        // Validate input
        $request->validate([
            'login'    => 'required|string', // email OR phone
            'password' => 'required|string',
        ]);

        try {
            // Use 'email' instead of 'username' if your table has no 'username'
            $user = User::where('email', $request->login)
                ->orWhere('phone', $request->login)
                ->first();
        } catch (\Exception $e) {
            // Catch any unexpected errors
            return response()->json([
                'message' => 'Something went wrong. Please try again.'
            ], 500);
        }

        // Invalid credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid login or password.'
            ], 401);
        }

        // Admin only check
        if ($user->role != 1) {
            return response()->json([
                'message' => 'You do not have admin access.'
            ], 403);
        }

        // Create token
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
                'role'  => $user->role,
            ]
        ], 200);
    }
}
