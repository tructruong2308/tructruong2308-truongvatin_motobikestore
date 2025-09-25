<?php

// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Models\Product;

// class ProductController extends Controller
// {
//     // Lấy tất cả sản phẩm
//     public function index()
//     {
//         return Product::select([
//             'id',
//             'name',
//             'brand_id as brand',    // tạm trả brand_id, sau join bảng brand sẽ lấy tên
//             'price_sale as price',
//             'thumbnail',
//         ])->latest('id')->get();
//     }

//     // Lấy chi tiết sản phẩm theo id
//     public function show($id)
//     {
//         $product = Product::select([
//             'id',
//             'name',
//             'brand_id as brand',
//             'price_sale as price',
//             'thumbnail',
//             'detail',
//             'description',
//         ])->find($id);

//         if (!$product) {
//             return response()->json(['message' => 'Not found'], 404);
//         }

//         return $product;
//     }

//     //danh mục sản phẩm
// public function byCategory($id)
// {
//     return Product::where('category_id', $id)->get();
// }


// }



namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    // Danh sách sản phẩm
    public function index()
    {
        $products = Product::with('brand:id,name') // ✅ eager-load brand
            ->select(['id','name','brand_id','price_sale as price','thumbnail'])
            ->latest('id')
            ->get();

        // Ẩn quan hệ thô, FE dùng brand_name & thumbnail_url
        return $products->makeHidden(['brand','brand_id']);
    }

    // Chi tiết sản phẩm
    public function show($id)
    {
        $p = Product::with('brand:id,name')
            ->select(['id','name','brand_id','price_sale as price','thumbnail','detail','description','category_id',])
            ->find($id);

        if (!$p) return response()->json(['message' => 'Not found'], 404);

        return $p->makeHidden(['brand','brand_id']);
    }
public function byCategory($id)
{
    return Product::where('category_id', $id)
        ->select(['id','name','price_sale as price','thumbnail'])
        ->latest('id')
        ->get();
}
}


