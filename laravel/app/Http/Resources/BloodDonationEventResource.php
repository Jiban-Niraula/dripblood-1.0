<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BloodDonationEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'camp_code' => $this->camp_code,
            'camp_name' => $this->camp_name,
            'organized_by' => $this->organized_by,
            'supporting_hospital' => $this->supporting_hospital,
            'location' => $this->location,
            'camp_type' => $this->camp_type,

            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date'   => $this->end_date?->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time'   => $this->end_time,

            'coordinator_name' => $this->coordinator_name,
            'coordinator_contact' => $this->coordinator_contact,
            'coordinator_email' => $this->coordinator_email,

            'expected_donors' => $this->expected_donors,
            'actual_donors' => $this->actual_donors,

            'status' => $this->status,
            'description' => $this->description,

            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),

            'creator' => $this->whenLoaded('creator', function () {
                return [
                    'id' => $this->creator->id,
                    'full_name' => $this->creator->full_name,
                    'email' => $this->creator->email,
                ];
            }),
        ];
    }
}
