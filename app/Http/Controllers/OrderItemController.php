<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function show(OrderItem $order)
    {
        $order->load(['product', 'transaction']);

        return inertia('orders/show', [
            'order' => new OrderItemResource($order),
        ]);
    }
}
