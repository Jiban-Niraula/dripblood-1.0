<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    // Fields that can be mass assigned
    protected $fillable = [
        'name',
        'email',
        'password',
        'otp',
        'otp_created_at',
        'phone',
        'address',
        'blood_group',
        'dob',
        'image',
        'role',
    ];

    // Fields hidden from JSON responses
    protected $hidden = [
        'password',
        'otp',
        'otp_created_at',
    ];

    // Casting fields to appropriate data types
    protected $casts = [
        'role'           => 'integer',
        'otp_created_at' => 'datetime',
        'dob'            => 'date',
    ];
}
