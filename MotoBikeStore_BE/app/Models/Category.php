<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // Nói rõ tên bảng trong DB
    protected $table = 'uttt_category';

    protected $fillable = [
        'name',
        'slug',
    ];
}
