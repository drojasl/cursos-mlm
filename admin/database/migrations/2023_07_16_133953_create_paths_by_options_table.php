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
        Schema::create('paths_by_options', function (Blueprint $table) {
            $table->id();
            $table->string('options');
            $table->unsignedBigInteger('path_id');
            $table->timestamps();

            $table->foreign('path_id')->references('id')->on('paths');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paths_by_options');
    }
};
