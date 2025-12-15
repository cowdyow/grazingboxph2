<?php

namespace App\Http\Resources;

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
            'status' => $this->status,
            'created_at' => $this->created_at,

            'product_name' => $this->whenLoaded('product', function ($item) {
                return $item->name;
            }),
            'transaction' => new TransactionResource($this->whenLoaded('transaction')),
        ];
    }
}
