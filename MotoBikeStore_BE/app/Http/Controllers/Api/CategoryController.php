<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        $cats = Category::orderBy('sort_order', 'asc')->get();
        return response()->json(['data' => $cats]);
    }

    // GET /api/categories/{id}
    public function show($id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json(['data' => $cat]);
    }

    // GET /api/categories/{id}/products
    public function products($id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $products = $cat->products()->with('brand:id,name')->get();
        return response()->json(['data' => $products]);
    }

    // POST /api/categories  (auth required)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['required', 'string', 'max:255', 'unique:ntt_category,slug'],
            'image'       => ['nullable', 'string', 'max:255'], // tên file ảnh (nếu đã upload sẵn)
            'parent_id'   => ['nullable', 'integer'],
            'sort_order'  => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
        ]);

        $cat = Category::create($data);
        return response()->json(['data' => $cat], 201);
    }

    // PUT /api/categories/{id}  (auth required)
    public function update(Request $request, $id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $data = $request->validate([
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'slug'        => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('ntt_category', 'slug')->ignore($cat->id)
            ],
            'image'       => ['nullable', 'string', 'max:255'],
            'parent_id'   => ['nullable', 'integer'],
            'sort_order'  => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
        ]);

        $cat->update($data);
        return response()->json(['data' => $cat]);
    }

    // DELETE /api/categories/{id}  (auth required)
    public function destroy($id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $cat->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
