<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class RegistrationController extends Controller 
{
    // ---------------- Step 1: Save personal info + OTP ----------------
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'full_name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'street_address' => 'required|string',
                'city' => 'nullable|string',
                'state_province' => 'nullable|string',
                'zip_code' => 'nullable|string',
                'country' => 'nullable|string',
                'blood_type' => 'required|string',
                'dob' => 'nullable|string', // optional, will convert
                'gender' => 'nullable|in:male,female,other',
                'profile_image' => 'nullable|string', // base64
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if email/phone exists
            if (User::where('email', $request->email)->exists() || User::where('phone', $request->phone)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email or Phone already registered'
                ], 409);
            }

            // Convert DOB
            $dob = null;
            if (!empty($request->dob)) {
                $timestamp = strtotime($request->dob);
                if ($timestamp !== false) $dob = date('Y-m-d', $timestamp);
            }

            // Handle image
            $imagePath = null;
            if (!empty($request->profile_image)) {
                $image = $request->profile_image;
                $imageName = time() . '_' . uniqid() . '.png';
                $imageFolder = public_path('uploads/ProfileImages');

                if (!file_exists($imageFolder)) mkdir($imageFolder, 0755, true);

                file_put_contents($imageFolder . '/' . $imageName, base64_decode($image));
                $imagePath = 'uploads/ProfileImages/' . $imageName;
            }

            // Generate OTP
            $otp = rand(1000, 9999);

            // Save to cache 10 minutes
            $cacheKey = "register_{$request->phone}";
            Cache::put($cacheKey, [
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'street_address' => $request->street_address,
                'city' => $request->city,
                'state_province' => $request->state_province,
                'zip_code' => $request->zip_code,
                'country' => $request->country,
                'blood_type' => $request->blood_type,
                'dob' => $dob,
                'gender' => $request->gender,
                'profile_image' => $imagePath,
                'otp' => $otp,
                'otp_created_at' => now()->timestamp,
            ], now()->addMinutes(10));

            Log::channel('otp')->info("OTP for {$request->phone} is: $otp");

            return response()->json([
                'success' => true,
                'message' => 'OTP sent. Verify and set password to complete registration.',
                'cache_key' => $cacheKey,
                'otp' => $otp // For testing only
            ], 200);

        } catch (\Throwable $e) {
            Log::error('Register Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error.'
            ], 500);
        }
    }

    // ---------------- Step 2: Complete Registration ----------------
    public function completeRegistration(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cache_key' => 'required|string',
                'otp' => 'required|digits:4',
                'password' => 'required|min:6|confirmed', // password_confirmation
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
                    'message' => 'Registration expired. Please try again.'
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

            // Save user
            $user = User::create([
                'full_name' => $cachedData['full_name'],
                'email' => $cachedData['email'],
                'phone' => $cachedData['phone'],
                'street_address' => $cachedData['street_address'],
                'city' => $cachedData['city'],
                'state_province' => $cachedData['state_province'],
                'zip_code' => $cachedData['zip_code'],
                'country' => $cachedData['country'],
                'blood_type' => $cachedData['blood_type'],
                'dob' => $cachedData['dob'],
                'gender' => $cachedData['gender'],
                'profile_image' => $cachedData['profile_image'],
                'password' => Hash::make($request->password),
                'user_type' => 'general',
                'status' => 'active',
            ]);

            Cache::forget($request->cache_key);

            return response()->json([
                'success' => true,
                'message' => 'Registration completed successfully',
                'user_uid' => $user->uid,
                'image_url' => $user->profile_image ? url($user->profile_image) : null,
            ], 201);

        } catch (\Throwable $e) {
            Log::error('Complete Registration Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error.'
            ], 500);
        }
    }
}
