<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerCodes extends Model
{
    use HasFactory;

    protected $table = 'customer_codes';

    protected $fillable = ['code', 'user_id'];
}
