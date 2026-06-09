<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Change the enum in users table
        DB::statement("ALTER TABLE users MODIFY COLUMN class ENUM('JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3') NULL");
        
        // Change the enum in topics table
        DB::statement("ALTER TABLE topics MODIFY COLUMN class ENUM('JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN class ENUM('SS1', 'SS2', 'SS3') NULL");
        DB::statement("ALTER TABLE topics MODIFY COLUMN class ENUM('SS1', 'SS2', 'SS3') NOT NULL");
    }
};