<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NodeConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'node_source_id',
        'node_target_id',
        'source',
        'target',
    ];
}
