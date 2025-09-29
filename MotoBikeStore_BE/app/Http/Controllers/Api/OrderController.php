<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        // ✅ Validate dữ liệu gửi lên
        $data = $request->validate([
            'customer_name'   => 'required|string|max:100',
            'phone'           => 'required|string|max:20',
            'address'         => 'required|string|max:255',
            'email'           => 'required|email|max:255', // 🔒 bắt buộc email
            'items'           => 'required|array|min:1',
            'items.*.id'      => 'required|integer',
            'items.*.name'    => 'required|string',
            'items.*.price'   => 'required|numeric',
            'items.*.qty'     => 'required|integer|min:1',
        ]);

        // ✅ Tính tổng tiền
        $total = collect($data['items'])->sum(fn($i) => $i['price'] * $i['qty']);

        // ✅ Tạo đơn hàng
// app/Http/Controllers/Api/OrderController.php
        $order = Order::create([
            'name'    => $data['customer_name'],
            'phone'   => $data['phone'],
            'email'   => $data['email'],
            'address' => $data['address'],
            'user_id' => Auth::id() ?? 0,
            'status'  => 0,
             'note'    => 'Tổng đơn: '.number_format($total,0,',','.').' đ',
            
        ]);
        
        // ✅ Thêm chi tiết đơn hàng
        foreach ($data['items'] as $item) {
            OrderDetail::create([
                'order_id'   => $order->id,
                'product_id' => $item['id'],
                'price_buy'  => $item['price'],                  // 👈 khớp DB
                'qty'        => $item['qty'],                    // 👈 khớp DB
                'amount'     => $item['price'] * $item['qty'],   // 👈 khớp DB
            ]);
        }

        return response()->json([
            'message'  => 'Đặt hàng thành công',
            'order_id' => $order->id,
            'total'    => $total,
        ]);
    }
}
