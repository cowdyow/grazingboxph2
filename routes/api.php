<?php

use App\Http\Controllers\API\SearchCustomerController;
use App\Http\Controllers\ProductController;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::name('api.')->group(function () {
    Route::post('/api/customer/search', SearchCustomerController::class)
        ->name('customer.search');

    Route::get('/api/products', function () {
        $products = Product::orderBy('name')->get();
        return $products;
    });

    Route::get('/api/customers', function () {
        $customer = Customer::get();
        return $customer;
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
