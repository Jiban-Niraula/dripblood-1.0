<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uid' => $this->uid,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip_code' => $this->zip_code,
            'country' => $this->country,
            'blood_type' => $this->blood_type,
            'medical_conditions' => $this->medical_conditions,
            'profile_image' => $this->profile_image ? (
                str_starts_with($this->profile_image, 'http') ? $this->profile_image : (
                    str_starts_with($this->profile_image, 'uploads/') ? asset($this->profile_image) : asset('storage/' . $this->profile_image)
                )
            ) : null,
            'type' => $this->type,
            'role' => $this->role,
            'status' => $this->status,
            'notes' => $this->notes,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),

            'donation_history' => $this->whenLoaded('donations', function () {
                return $this->donations->map(function ($donation) {
                    return [
                        'id' => $donation->id,
                        'event_name' => $donation->bloodDonationEvent->camp_name,
                        'registered_at' => $donation->registered_at?->toDateTimeString(),
                        'status' => $donation->status,
                        'donation_time' => $donation->donation_time?->toDateTimeString(),
                        'blood_type_donated' => $donation->blood_type_donated,
                        'units_donated' => $donation->units_donated,
                    ];
                });
            }),
        ];
    }
}