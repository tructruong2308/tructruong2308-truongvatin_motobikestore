<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'ntt_product';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'price_root',
        'price_sale',
        'thumbnail',
        'qty',
        'detail',
        'description',
        'status',
    ];

    protected $casts = [
        'price_root' => 'float',
        'price_sale' => 'float',
        'qty'        => 'integer',
        'status'     => 'integer', // 1=active, 0=inactive
    ];

    // => FE dùng trực tiếp, không cần xử lý lại
    protected $appends = [
        'thumbnail_url',
        'brand_name',
        'category_name',
        'price_final',
    ];

    /* =========================
     | Quan hệ
     * ========================= */
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /* =========================
     | Accessors (thuộc tính ảo)
     * ========================= */
    public function getBrandNameAttribute()
    {
        return optional($this->brand)->name;
    }

    public function getCategoryNameAttribute()
    {
        return optional($this->category)->name;
    }

    public function getPriceFinalAttribute()
    {
        // Giá ưu tiên: price_sale nếu có, ngược lại price_root
        return $this->price_sale ?: ($this->price_root ?: 0.0);
    }

    public function getThumbnailUrlAttribute()
    {
        // Nếu trống -> ảnh mặc định
        if (!$this->thumbnail) {
            return asset('assets/images/no-image.png');
        }

        $path = ltrim((string) $this->thumbnail, '/');

        // Đã là URL tuyệt đối
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Đường dẫn đã nằm trong public/assets/...
        if (str_starts_with($path, 'assets/')) {
            return asset($path);
        }

        // File đã public qua storage:link (public/storage/...)
        if (str_starts_with($path, 'storage/')) {
            return asset($path);
        }

        // Mặc định: trỏ vào public/assets/images/{thumbnail}
        return asset('assets/images/' . $path);
    }

    /* =========================
     | Scopes hay dùng
     * ========================= */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeInStock($query)
    {
        return $query->where('qty', '>', 0);
    }

    // Tìm theo tên/slug (không dấu cơ bản & like)
    public function scopeSearch($query, ?string $keyword)
    {
        if (!$keyword) return $query;

        $kw = trim($keyword);
        return $query->where(function ($q) use ($kw) {
            $q->where('name', 'like', "%{$kw}%")
              ->orWhere('slug', 'like', "%{$kw}%");
        });
    }
}
