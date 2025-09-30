<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // ================== DANH SÁCH ĐƠN HÀNG ==================
    public function index()
    {
        // Lấy tất cả đơn hàng, kèm chi tiết để tính tổng tiền
        $orders = Order::with('details')
            ->orderByDesc('id')
            ->get()
            ->map(function ($o) {
                $o->total = $o->details->sum(fn($d) => $d->price_buy * $d->qty);
                return $o;
            });

        return response()->json(['data' => $orders]);
    }

    // ================== XEM CHI TIẾT 1 ĐƠN ==================
public function show($id)
{
    $order = Order::with(['details.product'])->find($id);

    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    // tính tổng tiền
    $order->total = $order->details->sum(fn($d) => $d->price_buy * $d->qty);

    return response()->json($order);
}
    // ================== TẠO ĐƠN HÀNG (CHECKOUT) ==================
    public function checkout(Request $request)
    {
        // Validate dữ liệu
        $data = $request->validate([
            'customer_name'   => 'required|string|max:100',
            'phone'           => 'required|string|max:20',
            'address'         => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'items'           => 'required|array|min:1',
            'items.*.id'      => 'required|integer',
            'items.*.name'    => 'required|string',
            'items.*.price'   => 'required|numeric',
            'items.*.qty'     => 'required|integer|min:1',
        ]);

        // Tính tổng tiền
        $total = collect($data['items'])->sum(fn($i) => $i['price'] * $i['qty']);

        // Tạo đơn hàng
        $order = Order::create([
            'name'    => $data['customer_name'],
            'phone'   => $data['phone'],
            'email'   => $data['email'],
            'address' => $data['address'],
            'user_id' => Auth::id() ?? 0,
            'status'  => 0,
            'note'    => 'Tổng đơn: ' . number_format($total, 0, ',', '.') . ' đ',
        ]);

        // Thêm chi tiết đơn hàng
        foreach ($data['items'] as $item) {
            OrderDetail::create([
                'order_id'   => $order->id,
                'product_id' => $item['id'],
                'price_buy'  => $item['price'],
                'qty'        => $item['qty'],
                'amount'     => $item['price'] * $item['qty'],
            ]);
        }

        return response()->json([
            'message'  => 'Đặt hàng thành công',
            'order_id' => $order->id,
            'total'    => $total,
        ]);
    }

    // ================== CẬP NHẬT TRẠNG THÁI ==================
    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $request->validate([
            'status' => 'required|integer',
        ]);

        $order->status = $request->input('status');
        $order->save();

        return response()->json(['message' => 'Status updated']);
    }
}
