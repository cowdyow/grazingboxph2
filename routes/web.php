<?php

use App\Http\Controllers\NewTransactionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('products', ProductController::class);

    Route::resource('transactions', TransactionController::class);

    Route::post('/new-transaction', NewTransactionController::class)
        ->name('orders.store');



    require __DIR__ . '/api.php';
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
