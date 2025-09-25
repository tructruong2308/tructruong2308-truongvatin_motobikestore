<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'ntt_category';   // tên bảng
    protected $primaryKey = 'id';        // khóa chính
    public $timestamps = false;          // nếu bảng không có created_at, updated_at

    protected $fillable = [
        'name',
        'slug',
        'image',
        'parent_id',
        'sort_order',
        'description'
    ];

    // ✅ thêm field image_url vào JSON trả về
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image
            ? url('assets/images/' . $this->image)
            : null;
    }

    // Quan hệ với Product
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
