<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\BloodDonationEventController;
use App\Http\Controllers\Api\DonationRegistrationController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('register', [RegistrationController::class, 'register']);
Route::post('complete-registration', [RegistrationController::class, 'completeRegistration']);

Route::post('login', [LoginController::class, 'login']);
Route::post('admin-login', [LoginController::class, 'adminLogin']);

/*
|--------------------------------------------------------------------------
| USERS CRUD (NO AUTH)
|--------------------------------------------------------------------------
*/

Route::get('users', [UserController::class, 'index']);
Route::get('users/{id}', [UserController::class, 'show']);
Route::post('users', [UserController::class, 'store']);
Route::put('users/{id}', [UserController::class, 'update']);
Route::delete('users/{id}', [UserController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| BLOOD DONATION EVENTS CRUD (NO AUTH)
|--------------------------------------------------------------------------
*/

Route::get('blood-donation-event', [BloodDonationEventController::class, 'index']);
Route::get('blood-donation-event/{id}', [BloodDonationEventController::class, 'show']);
Route::post('blood-donation-event', [BloodDonationEventController::class, 'store']);
Route::put('blood-donation-event/{id}', [BloodDonationEventController::class, 'update']);
Route::delete('blood-donation-event/{id}', [BloodDonationEventController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| DONATION REGISTRATIONS CRUD (NO AUTH)
|--------------------------------------------------------------------------
*/

Route::get('donation-registrations', [DonationRegistrationController::class, 'index']);
Route::get('donation-registrations/{id}', [DonationRegistrationController::class, 'show']);
Route::post('donation-registrations', [DonationRegistrationController::class, 'store']);
Route::put('donation-registrations/{id}', [DonationRegistrationController::class, 'update']);
Route::delete('donation-registrations/{id}', [DonationRegistrationController::class, 'destroy']);