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
        Schema::create('nodes_in_path', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('path_id');
            $table->unsignedBigInteger('node_id');
            $table->timestamps();

            $table->foreign('path_id')->references('id')->on('paths');
            $table->foreign('node_id')->references('id')->on('nodes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nodes_in_path');
    }
};
