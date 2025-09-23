<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;

// ========== PRODUCT ==========
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories/{id}/products', [ProductController::class, 'byCategory']); // lọc sp theo category

// ========== CATEGORY ==========
Route::get('/categories', [CategoryController::class, 'index']);        // danh sách category
Route::get('/categories/{id}', [CategoryController::class, 'show']);   // chi tiết 1 category

// ========== TEST ==========
Route::get('/hello', function () {
    return 'Hello Laravel';
});
