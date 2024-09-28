<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUsedLimitToAccessCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('access_codes', function (Blueprint $table) {
            $table->integer('used_limit')->nullable()->after('updated_at'); // Aquí 'updated_at' es un ejemplo, reemplázalo por el nombre de la columna que sigue después de la cual deseas agregar 'used_limit'
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
            $table->dropColumn('used_limit');
        });
    }
}
