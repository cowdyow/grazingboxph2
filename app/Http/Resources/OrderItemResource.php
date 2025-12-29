<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'transaction_id' => $this->transaction_id,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'delivery_date' => $this->delivery_date,
            'delivery_address' => $this->delivery_address,
            'memo' => $this->memo,
            'booking_type' => $this->booking_type,
            'picked_up_at' => $this->picked_up_at,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'delivery_time' => Carbon::parse($this->delivery_date)->format('g:i A'),


            'product_name' => $this->whenLoaded('product', function ($item) {
                return $item->name;
            }),
            'transaction' => new TransactionResource($this->whenLoaded('transaction')),
            'lalamove' => new LalamoveResource($this->whenLoaded('lalamove')),
        ];
    }
}
