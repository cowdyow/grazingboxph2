<?php

namespace App\Http\Controllers;

use App\Models\LalamoveRider;
use Illuminate\Http\Request;

class LalamoveRiderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $riders = LalamoveRider::query()
            ->when($request->search, function ($query, $search) {
                $query->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('rider_name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return inertia('lalamove/index', [
            'riders' => $riders,
            'filters' => $request->only('search'),
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
        $validated = $request->validate([
            'customer_name' => 'nullable|string',
            'rider_name' => 'nullable|string',
            'contact_no' => 'nullable|string',
            'status' => 'required|in:preparing,ready,picked_up',
            'memo' => 'nullable|string',
        ]);

        LalamoveRider::create($validated);

        return redirect()->route('lalamove.index')
            ->with('success', 'Lalamove Rider has been added');
    }

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
    public function update(Request $request, LalamoveRider $lalamove)
    {
        $lalamove->update([
            'customer_name' => $request->customer_name,
            'rider_name' => $request->rider_name,
            'contact_no' => $request->contact_no,
            'status' => $request->status,
            'memo' => $request->memo,
        ]);

        if ($request->status == 'picked_up') {
            $lalamove->update([
                'picked_up_at' => now()
            ]);
        }

        return redirect()->route('lalamove.index')
            ->with('success', 'Lalamove Rider has been updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}