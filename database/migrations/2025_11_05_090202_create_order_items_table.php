<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity');
            $table->enum('booking_type', [
                'pickup',
                'customer_booked',
                'staff_booked',
            ])->nullable();
            $table->dateTime('delivery_date');
            $table->string('delivery_address')->nullable();
            $table->string('memo')->nullable()->default(null);
            $table->enum('status', ['pending', 'in-progress', 'ready', 'completed'])->default('Pending');
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
