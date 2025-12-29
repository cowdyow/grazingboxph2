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
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Get all order items with their transaction and product
        $orderItems = OrderItem::with(['product', 'transaction'])
            ->whereHas('transaction', function ($query) use ($currentMonth, $currentYear) {
                $query->whereYear('created_at', $currentYear)
                    ->whereMonth('created_at', $currentMonth);
            })
            ->get();

        // Dashboard counts for current month
        $dashboardCount = [
            'totalOrders' => $orderItems->pluck('transaction_id')->unique()->count(),
            'totalBoxes' => $orderItems->sum('quantity'),
            'products' => $orderItems
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
            'orderItems' => OrderItemResource::collection($orderItems),
            'dashboardCount' => $dashboardCount,
        ]);
    }
}