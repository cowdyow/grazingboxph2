<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            'customer_id' => $this->customer_id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'created_at' => $this->created_at->format('M d, Y'),

            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
        ];
    }
}
