<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function index(Request $request)
    {
        $now = Carbon::now();
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        // Aggregate quantities per product per day
        $orderItems = OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'order_items.product_id',
                DB::raw('DAY(order_items.delivery_date) as day'),
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * products.price) as total_amount')
            )
            ->whereYear('order_items.delivery_date', $year)
            ->whereMonth('order_items.delivery_date', $month)
            ->groupBy('order_items.product_id', DB::raw('DAY(order_items.delivery_date)'))
            ->get();

        $products = Product::all();

        $salesData = [];
        foreach ($products as $product) {
            $salesData[$product->name] = array_fill(1, $now->daysInMonth, 0);
        }

        $amountData = array_fill(1, $now->daysInMonth, 0);

        foreach ($orderItems as $item) {
            $product = $products->firstWhere('id', $item->product_id);
            if (!$product) continue;

            $productName = $product->name;
            $day = $item->day;

            $salesData[$productName][$day] = $item->total_quantity;

            $amountData[$day] += $item->total_amount;
        }


        return inertia('sales/index', [
            'salesData' => $salesData,
            'amountData' => $amountData,
            'daysInMonth' => $now->daysInMonth,
            'selectedMonth' => $month,
            'selectedYear' => $year,
        ]);
    }
}
