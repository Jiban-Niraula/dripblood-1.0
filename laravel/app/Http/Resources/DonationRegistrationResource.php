<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationRegistrationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'blood_type' => $this->user->blood_type,
            ],
            'blood_donation_event' => [
                'id' => $this->bloodDonationEvent->id,
                'camp_code' => $this->bloodDonationEvent->camp_code,
                'camp_name' => $this->bloodDonationEvent->camp_name,
                'location' => $this->bloodDonationEvent->location,
                'start_date' => $this->bloodDonationEvent->start_date?->format('Y-m-d'),
                'end_date' => $this->bloodDonationEvent->end_date?->format('Y-m-d'),
            ],
            'registered_at' => $this->registered_at?->toDateTimeString(),
            'status' => $this->status,
            'donation_time' => $this->donation_time?->toDateTimeString(),
            'blood_type_donated' => $this->blood_type_donated,
            'units_donated' => $this->units_donated,
            'notes' => $this->notes,
            'result' => $this->result,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
