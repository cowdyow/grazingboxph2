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
        Schema::create('lalamove_riders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_item_id')
                ->nullable()
                ->constrained('order_items')
                ->onDelete('cascade');

            $table->string('customer_name')->nullable();
            $table->string('rider_name')->nullable();
            $table->string('contact_no', 20)->nullable();

            $table->enum('status', ['preparing', 'ready', 'picked_up'])
                ->default('preparing');

            $table->string('memo')->nullable();

            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lalamove_riders');
    }
};