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
        Schema::create('nexts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('node_id');
            $table->string('label');
            $table->timestamps();

            $table->foreign('node_id')->references('id')->on('nodes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nexts');
    }
};
