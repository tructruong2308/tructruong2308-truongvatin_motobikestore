<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'uttt_product';
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
    ];

    protected $appends = ['thumbnail_url'];
    protected $hidden  = ['thumbnail'];

    /**
     * Lấy URL ảnh sản phẩm, hỗ trợ nhiều định dạng (jpg, jpeg, png, webp...)
     */
    public function getThumbnailUrlAttribute()
    {
        $path = $this->thumbnail;

        // Nếu trống -> fallback
        if (!$path) {
            return asset('assets/images/no-image.png');
        }

        $path = ltrim($path, '/');

        // Nếu DB lưu sẵn full URL
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        // Nếu DB lưu dạng "assets/..."
        if (str_starts_with($path, 'assets/')) {
            return asset($path);
        }

        // Thư mục chứa ảnh
        $baseDir = public_path('assets/images/');
        $baseUrl = asset('assets/images');

        // Nếu DB có sẵn đuôi ảnh
        if (preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $path)) {
            if (file_exists($baseDir . $path)) {
                return $baseUrl . '/' . $path;
            }
        } else {
            // Nếu DB chỉ lưu tên file, thử nối các đuôi phổ biến
            $exts = ['jpg', 'jpeg', 'png', 'webp'];
            foreach ($exts as $ext) {
                $try = $path . '.' . $ext;
                if (file_exists($baseDir . $try)) {
                    return $baseUrl . '/' . $try;
                }
            }
        }

        // Nếu không tìm thấy file nào -> fallback
        return $baseUrl . '/no-image.png';
    }
}
