<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameNodeIdToUrlInPathsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('paths', function (Blueprint $table) {
            // Eliminar la clave foránea de 'node_id'
            $table->dropForeign(['node_id']);

            // Eliminar la columna 'node_id'
            $table->dropColumn('node_id');

            // Agregar la columna 'url' después de 'user_id'
            $table->string('url')->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('paths', function (Blueprint $table) {
            // Agregar nuevamente la columna 'node_id'
            $table->unsignedBigInteger('node_id')->after('user_id');

            // Volver a crear la clave foránea para 'node_id'
            $table->foreign('node_id')->references('id')->on('other_table')->onDelete('cascade');

            // Eliminar la columna 'url'
            $table->dropColumn('url');
        });
    }
}
