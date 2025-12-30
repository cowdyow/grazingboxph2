<?php

namespace App\Http\Services;

use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;

class DailyOrderService
{
    public function getDailySales($date)
    {
        $total = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->whereDate('order_items.delivery_date', $date)
            ->select(DB::raw('SUM(order_items.quantity * products.price) as total_sales'))
            ->value('total_sales');

        return $total ?? 0;
    }
}
