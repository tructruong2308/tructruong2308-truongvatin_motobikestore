<?php

namespace App\Models;

<<<<<<< HEAD:MotoBikeStore_BE/app/Models/Category.php
=======
use Illuminate\Database\Eloquent\Factories\HasFactory;
>>>>>>> cbbee2701c33398bd19c84ce4bf7d9278b7a2369:StoreVegetables_BE/app/Models/Category.php
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
<<<<<<< HEAD:MotoBikeStore_BE/app/Models/Category.php
    // Nói rõ tên bảng trong DB
    protected $table = 'uttt_category';

    protected $fillable = [
        'name',
        'slug',
    ];
}
=======
    use HasFactory;

    protected $table = 'uttt_category'; // ✅ trỏ đúng bảng trong DB

    protected $fillable = ['name', 'slug', 'image', 'parent_id', 'sort_order', 'description'];

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}

>>>>>>> cbbee2701c33398bd19c84ce4bf7d9278b7a2369:StoreVegetables_BE/app/Models/Category.php
