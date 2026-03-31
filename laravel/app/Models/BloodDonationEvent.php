<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodDonationEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'camp_code',
        'camp_name',
        'organized_by',
        'supporting_hospital',
        'location',
        'camp_type',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'coordinator_name',
        'coordinator_contact',
        'coordinator_email',
        'expected_donors',
        'actual_donors',
        'description',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function registrations()
    {
        return $this->hasMany(DonationRegistration::class);
    }
}
