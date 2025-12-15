<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\OrderItem;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $orderItems = OrderItem::with(['product', 'transaction'])->get();

        return inertia('dashboard', [

            'orderItems' => OrderItemResource::collection($orderItems),
        ]);
    }
}
