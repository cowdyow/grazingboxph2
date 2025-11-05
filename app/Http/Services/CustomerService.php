<?php

namespace App\Http\Services;

use App\Models\Customer;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function getOrCreate($request)
    {
        $customer = Customer::where('username', $request->username)->first();

        if ($customer == null) {
            $customer = Customer::create([
                'name' => $request->name,
                'username' => $request->username,
                'address' => $request->address,
                'phone' => $request->phone,
                'source' => $request->source
            ]);
        }

        return $customer->id;
    }
}
