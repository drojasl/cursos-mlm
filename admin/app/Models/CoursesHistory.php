<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoursesHistory extends Model
{
    protected $fillable = [
        'token',
        'path_id',
        'user_id',
    ];

    protected $table = 'courses_history';

    public function path()
    {
        return $this->belongsTo(Path::class, 'path_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
