<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\OrderItem;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */

    public function __invoke(Request $request)
    {
        // Fetch all order items for the calendar (no filtering)
        $orderItems = OrderItem::with(['product', 'transaction.customer'])
            ->get();

        // Calculate today's dashboard counts based on orderItems' delivery_date
        $today = Carbon::today();

        $todayOrderItems = OrderItem::with('product')
            ->whereDate('delivery_date', $today)
            ->get();

        $dashboardCount = [
            'totalOrders' => $todayOrderItems->pluck('transaction_id')->unique()->count(),
            'totalBoxes' => $todayOrderItems->sum('quantity'),
            'products' => $todayOrderItems
                ->groupBy('product_id')
                ->map(function ($items, $productId) {
                    return [
                        'product_id' => $productId,
                        'product_name' => $items->first()->product->name,
                        'total_quantity' => $items->sum('quantity'),
                    ];
                })
                ->values(),
        ];

        return inertia('dashboard', [
            'orderItems' => OrderItemResource::collection($orderItems), // for calendar
            'dashboardCount' => $dashboardCount, // for today's stats
        ]);
    }
}
