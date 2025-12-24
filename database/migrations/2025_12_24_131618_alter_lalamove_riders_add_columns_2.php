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
        Schema::table('lalamove_riders', function (Blueprint $table) {
            $table->string('product')->nullable()->after('delivery_time');
            $table->integer('quantity')->nullable()->after('product');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lalamove_riders', function (Blueprint $table) {
            $table->dropColumn(['product', 'quantity']);
        });
    }
};
