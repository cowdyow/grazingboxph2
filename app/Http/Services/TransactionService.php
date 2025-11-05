<?php

namespace App\Http\Services;

use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;

class TransactionService
{

    public function generateOrderNumber()
    {
        $datePart = now()->format('Ym');

        $count = Transaction::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();

        $sequence = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        return "{$datePart}{$sequence}";
    }
}