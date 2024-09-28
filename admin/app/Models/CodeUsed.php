<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeUsed extends Model
{
    use HasFactory;

    protected $table = 'code_used';

    protected $fillable = [
        'access_code_id',
        'token',
    ];

    public $timestamps = true;

    public function accessCode()
    {
        return $this->belongsTo(AccessCode::class, 'access_code_id');
    }
}
