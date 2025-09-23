<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::select('id','name','slug')->orderBy('name')->get();
    }

    public function show($id)
    {
        return Category::select('id','name','slug')->findOrFail($id);
    }

    public function products($id)
    {
        $category = Category::findOrFail($id);

        return $category->products()
            ->with('category:id,name')
            ->select('id','category_id','name','price','thumbnail_url')
            ->latest('id')
            ->paginate(12);
    }
}
