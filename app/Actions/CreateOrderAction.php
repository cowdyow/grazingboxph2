<?php

namespace App\Actions;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreateOrderAction
{
    public function execute(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {

            /*
            |--------------------------------------------------------------------------
            | 1. Find or create customer
            |--------------------------------------------------------------------------
            */

            $customer = Customer::firstOrCreate(
                [
                    'contact_number' => $data['customer']['contact_number'],
                ],
                [
                    'name' => $data['customer']['name'],
                ]
            );

            /*
            |--------------------------------------------------------------------------
            | 2. Create transaction
            |--------------------------------------------------------------------------
            */

            $transaction = Transaction::create([
                'customer_id' => $customer->id,
                'order_number' => $this->generateOrderNumber(),
                'status' => 'Pending',
                'total_amount' => null,
            ]);

            /*
            |--------------------------------------------------------------------------
            | 3. Create order items
            |--------------------------------------------------------------------------
            */

            foreach ($data['orders'] as $order) {

                $product = Product::where(
                    'name',
                    $order['product_name']
                )->first();

                if (!$product) {
                    throw new RuntimeException(
                        "Product '{$order['product_name']}' was not found."
                    );
                }

                $transaction->orderItems()->create([
                    'product_id' => $product->id,
                    'quantity' => $order['quantity'],
                    'delivery_date' => $order['delivery_date'],
                    'delivery_address' => $order['delivery_address'] ?? null,
                    'memo' => $order['dedication'] ?? null,
                    'status' => 'Pending',
                ]);
            }

            return $transaction;
        });
    }

    private function generateOrderNumber(): string
    {
        return 'GB-' . now()->format('YmdHis');
    }
}