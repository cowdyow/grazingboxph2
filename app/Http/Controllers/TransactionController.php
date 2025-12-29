<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $month = $request->query('month'); // expected format: YYYY-MM

        $transactions = Transaction::with(['customer'])
            ->when($month, function ($query, $month) {
                $query->whereMonth('created_at', '=', date('m', strtotime($month)))
                    ->whereYear('created_at', '=', date('Y', strtotime($month)));
            })
            ->get();

        return inertia('transaction/index', [
            'transactions' => TransactionResource::collection($transactions),
            'selectedMonth' => $month ?? now()->format('Y-m'), // for frontend default
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['orderItems.product', 'customer']);

        return inertia('transaction/show', [
            'transaction' => new TransactionResource($transaction)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
