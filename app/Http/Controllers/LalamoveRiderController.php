<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\LalamoveRider;
use App\Models\OrderItem;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LalamoveRiderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterDate = $request->date ? Carbon::parse($request->date) : Carbon::today();

        $orders = OrderItem::whereDate('delivery_date', $filterDate)
            ->with(['transaction.customer', 'product', 'lalamove'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('transaction.customer', function ($q) use ($search) {
                    $q->where('username', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('delivery_date')
            ->get();

        $productCounts = $orders->groupBy('product_id')->map(function ($items, $productId) {
            $productName = $items->first()->product->name ?? 'Unknown';
            $totalQuantity = $items->sum('quantity');
            $completedQuantity = $items->where('status', 'completed')->sum('quantity');

            return [
                'product_id' => $productId,
                'product_name' => $productName,
                'total_quantity' => $totalQuantity,
                'completed_quantity' => $completedQuantity,
            ];
        })->values();

        return inertia('lalamove/index', [
            'orders' => OrderItemResource::collection($orders),
            'productCounts' => $productCounts,
            'date' => $filterDate,
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
    /* public function store(Request $request)
    {
        dd($request->all());
        $validated = $request->validate([
            'customer_name'  => 'nullable|string',
            'rider_name'     => 'nullable|string',
            'contact_no'     => 'nullable|string',
            'status'         => 'required|in:not_yet_started,preparing,ready,picked_up',
            'booking_type'   => 'nullable|in:pickup,customer_booked,staff_booked',
            'delivery_time'  => 'nullable|string',
            'memo'           => 'nullable|string',
            'product'           => 'nullable|string|max:255',
            'quantity'           => 'nullable',
        ]);

        LalamoveRider::create($validated);

        return redirect()->route('lalamove.index')
            ->with('success', 'Lalamove Rider has been added successfully.');
    } */


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, OrderItem $lalamove)
    {
        $lalamove->lalamove()->updateOrCreate(
            [],
            [
                'rider_name' => $request->rider_name,
                'contact_no' => $request->contact_no,
                'memo' => $request->memo,
            ]
        );

        if ($request->status === 'picked_up') {
            $lalamove->update([
                'picked_up_at' => now(),
            ]);
        }

        return redirect()
            ->route('lalamove.index')
            ->with('success', 'Lalamove Rider has been updated');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function updateStatus(Request $request, OrderItem $orderItem)
    {
        // Update the order item status
        $orderItem->update([
            'status' => $request->status,
        ]);

        if ($request->status == 'completed') {
            $orderItem->update([
                'picked_up_date' => now(),
            ]);
        }

        // Get the transaction
        $transaction = $orderItem->transaction;

        // Get all order items of this transaction
        $orderItems = $transaction->orderItems;

        // Check their statuses
        if ($orderItems->every(fn($item) => $item->status === 'completed')) {
            // All completed -> set transaction to Complete
            $transaction->update(['status' => 'Complete']);
        } elseif ($orderItems->contains(fn($item) => $item->status === 'completed' || $item->status === 'in-progress')) {
            // Any completed or in-progress -> set transaction to In-Progress
            $transaction->update(['status' => 'In-Progress']);
        } else {
            // None started -> keep Pending
            $transaction->update(['status' => 'Pending']);
        }

        return redirect()
            ->back()
            ->with('success', 'Order Status has been updated');
    }
}
