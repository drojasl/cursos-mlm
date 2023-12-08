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
        Schema::create('prospects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('path_id');
            $table->string('full_name');
            $table->string('country');
            $table->string('city');
            $table->string('email');
            $table->string('cellphone')->nullable();
            $table->timestamps();

            $table->foreign('path_id')->references('id')->on('paths');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prospects');
    }
};
