<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lalamove_riders', function (Blueprint $table) {
            $table->enum('booking_type', [
                'pickup',
                'customer_booked',
                'staff_booked',
            ])->nullable()->after('status');

            $table->string('delivery_time')->nullable()->after('booking_type');
        });
    }

    public function down(): void
    {
        Schema::table('lalamove_riders', function (Blueprint $table) {
            $table->dropColumn(['booking_type', 'delivery_time']);
        });
    }
};
