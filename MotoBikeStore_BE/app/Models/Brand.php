<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $table = 'ntt_brand';   // đổi đúng tên bảng của bạn
    public $timestamps = false;
    protected $fillable = ['name', 'slug', 'image'];
}


