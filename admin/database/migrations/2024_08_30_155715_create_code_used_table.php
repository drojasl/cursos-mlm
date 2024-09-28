<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCodeUsedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('code_used', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('access_code_id');
            $table->timestamp('used_at')->useCurrent();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('access_code_id')->references('id')->on('access_codes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('code_used');
    }
}
