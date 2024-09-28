<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPathIdToNodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nodes', function (Blueprint $table) {
            // Añadir la columna path_id y establecer la relación
            $table->unsignedBigInteger('path_id')->nullable()->after('id');

            // Establecer la relación con la tabla paths
            $table->foreign('path_id')->references('id')->on('paths')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('nodes', function (Blueprint $table) {
            // Eliminar la relación y la columna path_id
            $table->dropForeign(['path_id']);
            $table->dropColumn('path_id');
        });
    }
}
