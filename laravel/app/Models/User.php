<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'uid',
        'name',
        'email',
        'password',

        'phone',
        'date_of_birth',
        'gender',

        'address',
        'city',
        'state',
        'zip_code',
        'country',

        'blood_type',
        'medical_conditions',

        'profile_image',

        'role',
        'status',

        'notes',
        'created_by',
        'created_via',
    ];

    /**
     * Hidden fields
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
    ];

    /**
     * Auto UUID generation
     */
    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->uid)) {
                $user->uid = (string) Str::uuid();
            }

            // default role if not set
            if (empty($user->role)) {
                $user->role = 'user';
            }

            // default status
            if (empty($user->status)) {
                $user->status = 'active';
            }
        });
    }

    /**
     * Relationships
     */
    public function donations()
    {
        return $this->hasMany(DonationRegistration::class);
    }

    /**
     * Admin check
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Active user check (useful later)
     */
    public function isActive()
    {
        return $this->status === 'active';
    }
}