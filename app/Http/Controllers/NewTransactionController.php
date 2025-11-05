<?php

namespace App\Http\Controllers;

use App\Http\Services\CustomerService;
use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\Transaction;
use Illuminate\Http\Request;

class NewTransactionController extends Controller
{
    protected $customerService;
    protected $transactionService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }


    public function __invoke(Request $request)
    {
        $customerId = $this->customerService->getOrCreate($request);

        $transaction = Transaction::create([
            'customer_id' => $customerId,
            'order_number' => rand(1, 5),
            'status' => 'Pending',
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'transaction_id' => $transaction->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'delivery_date' => $item->delivery_date,
                'delivery_address' => $item->delivery_address,
                'memo' => $item->memo,
                'status' => 'Pending'
            ]);
        }
    }
}
