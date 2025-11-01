<?php

use App\Http\Controllers\API\SearchCustomerController;
use App\Http\Controllers\ProductController;
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
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
