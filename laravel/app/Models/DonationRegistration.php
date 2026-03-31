<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationRegistration extends Model
{
    protected $fillable = [
        'user_id',
        'blood_donation_event_id',
        'registered_at',
        'status',
        'donation_time',
        'blood_type_donated',
        'units_donated',
        'notes',
        'result',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'donation_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bloodDonationEvent()
    {
        return $this->belongsTo(BloodDonationEvent::class);
    }
}
