<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateAccessCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('access_codes', function (Blueprint $table) {
            // Eliminar la columna 'next_id'
            $table->dropColumn('next_id');

            // Agregar la columna 'path_id' después de 'access_code'
            $table->unsignedBigInteger('path_id')->after('access_code');

            // Crear una clave foránea para 'path_id' que referencia a 'id' en la tabla 'paths'
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
        Schema::table('access_codes', function (Blueprint $table) {
            // Eliminar la clave foránea de 'path_id'
            $table->dropForeign(['path_id']);

            // Eliminar la columna 'path_id'
            $table->dropColumn('path_id');

            // Volver a agregar la columna 'next_id'
            $table->unsignedBigInteger('next_id')->after('access_code');
        });
    }
}
