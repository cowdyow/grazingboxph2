<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify status enum to include 'not_yet_started' and set it as default
        DB::statement("
            ALTER TABLE lalamove_riders 
            MODIFY COLUMN status ENUM('not_yet_started', 'preparing', 'ready', 'picked_up') 
            NOT NULL DEFAULT 'not_yet_started'
        ");
    }

    public function down(): void
    {
        // Revert back to original enum
        DB::statement("
            ALTER TABLE lalamove_riders 
            MODIFY COLUMN status ENUM('preparing', 'ready', 'picked_up') 
            NOT NULL DEFAULT 'preparing'
        ");
    }
};
