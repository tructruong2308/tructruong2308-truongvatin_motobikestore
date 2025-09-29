<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// app/Models/Order.php
class Order extends Model
{
    use HasFactory;

    protected $table = 'ntt_order';
    protected $primaryKey = 'id';      // ✅ khóa chính
    public $timestamps = true;         // có created_at, updated_at



    protected $fillable = [
        'user_id','name','phone','email','address','note','status','updated_by',    ];

    // (không bắt buộc nhưng nên có)

    public function details()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', );
    }
}
