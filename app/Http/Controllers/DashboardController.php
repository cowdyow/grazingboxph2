<?php

namespace App\Http\Controllers;

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
        $transactions = Transaction::get();
        $orderItems = OrderItem::get();

        return inertia('dashboard', [
            'transactions' => $transactions,
            'orderItems' => $orderItems,
        ]);
    }
}
