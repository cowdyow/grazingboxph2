<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Services\CustomerService;
use App\Http\Services\TransactionService;
use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NewTransactionController extends Controller
{
    protected $customerService;
    protected $transactionService;

    public function __construct(CustomerService $customerService, TransactionService $transactionService)
    {
        $this->customerService = $customerService;
        $this->transactionService = $transactionService;
    }


    public function __invoke(StoreTransactionRequest $request)
    {
        try {
            DB::beginTransaction();

            $customer = $this->customerService->getOrCreate($request);

            $transaction = Transaction::create([
                'customer_id' => $customer->id,
                'order_number' => $this->transactionService->generateOrderNumber(),
                'status' => 'Pending',
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'delivery_date' => $item['delivery_date'],
                    'delivery_address' => $item['delivery_address'],
                    'booking_type' => $item['booking_type'],
                    'memo' => $item['memo'] ?? null,
                    'status' => 'Pending',
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Order has been added');
        } catch (\Throwable $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create order: ' . $e->getMessage());
        }
    }
}
