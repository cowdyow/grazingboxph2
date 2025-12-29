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

    public function update(Request $request, OrderItem $order)
    {
        $validated = $request->validate([
            'product_id' => 'required',
            'quantity' => 'required',
            'delivery_date' => 'required',
            'booking_type' => 'required',
        ]);

        $order->update([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'delivery_date' => $request->delivery_date,
            'booking_type' => $request->booking_type,
            'memo' => $request->memo,
        ]);

        return redirecT()->back()->with('success', 'Order has been updated.');
    }
}
