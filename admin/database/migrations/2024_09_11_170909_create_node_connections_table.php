<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNodeConnectionsTable extends Migration
{
    public function up()
    {
        Schema::create('node_connections', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('node_source_id');
            $table->unsignedBigInteger('node_target_id');
            $table->string('source');
            $table->string('target');
            $table->timestamps();

            $table->foreign('node_source_id')->references('id')->on('nodes')->onDelete('cascade');
            $table->foreign('node_target_id')->references('id')->on('nodes')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('node_connections');
    }
}
