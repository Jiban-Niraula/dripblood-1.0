<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('register', [AuthController::class, 'register']);
Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('set-password', [AuthController::class, 'setPassword']);
Route::post('login', [AuthController::class, 'login']);
Route::post('admin-login', [AuthController::class, 'adminLogin']);
Route::post('complete-registration', [AuthController::class, 'completeRegistration']);