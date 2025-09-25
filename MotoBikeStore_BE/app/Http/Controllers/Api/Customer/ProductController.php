<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    // Lấy tất cả sản phẩm
    public function index()
    {
        return Product::select([
            'id',
            'name',
            'brand_id as brand',    // tạm trả brand_id, sau join bảng brand sẽ lấy tên
            'price_sale as price',
            'thumbnail',
        ])->latest('id')->get();
    }

    // Lấy chi tiết sản phẩm theo id
    public function show($id)
    {
        $product = Product::select([
            'id',
            'name',
            'brand_id as brand',
            'price_sale as price',
            'thumbnail',
            'detail',
            'description',
        ])->find($id);

        if (!$product) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return $product;
    }

    //danh mục sản phẩm
    public function byCategory($id)
{
    return Product::where('category_id', $id)->get();
}

}
