<?php

use App\Http\Controllers\AIAssistantController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\API\SearchCustomerController;
use App\Http\Controllers\ProductController;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function () {

    Route::post('/customer/search', SearchCustomerController::class)
        ->name('customer.search');

    Route::get('/products', function () {
        return Product::orderBy('name')->get();
    });

    Route::get('/customers', function () {
        return Customer::get();
    });


    /*
    |--------------------------------------------------------------------------
    | AI Chat
    |--------------------------------------------------------------------------
    */

    // Get all conversations
Route::get('/conversations', [ChatController::class,'index',])->name('conversations.index');
    // Create a new conversation
    Route::post('/conversations', [
        ChatController::class,
        'store',
    ])->name('conversations.store');

    // Load a conversation and its messages
    Route::get('/conversations/{conversation}', [
        ChatController::class,
        'show',
    ])->name('conversations.show');

    // Send a message to a conversation
    Route::post('/conversations/{conversation}/messages', [
        ChatController::class,
        'message',
    ])->name('conversations.messages.store');

    // Delete a conversation
    Route::delete('/conversations/{conversation}', [
        ChatController::class,
        'destroy',
    ])->name('conversations.destroy');
});