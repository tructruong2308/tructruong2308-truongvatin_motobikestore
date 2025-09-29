<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ntt_order', function (Blueprint $table) {
            $table->unsignedBigInteger('total')->default(0)->after('note');
        });
    }

    public function down(): void
    {
        Schema::table('ntt_order', function (Blueprint $table) {
            $table->dropColumn('total');
        });
    }
};
