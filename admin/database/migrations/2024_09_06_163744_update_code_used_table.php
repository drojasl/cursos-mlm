<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCodeUsedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('code_used', function (Blueprint $table) {
            // Eliminar la columna 'used_at'
            $table->dropColumn('used_at');

            // Agregar la columna 'token' de tipo longtext
            $table->longText('token')->after('access_code_id'); // Coloca después de 'access_code_id' o ajusta según sea necesario
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('code_used', function (Blueprint $table) {
            // Agregar la columna 'used_at' de nuevo (si es necesario en la reversión)
            $table->timestamp('used_at')->nullable();

            // Eliminar la columna 'token'
            $table->dropColumn('token');
        });
    }
}
