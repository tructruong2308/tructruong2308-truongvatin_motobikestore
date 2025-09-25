<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;  
use App\Http\Controllers\Api\CategoryController;
// use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;



Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/{id}/products', [ProductController::class, 'byCategory']);

// API register (POST)
// Route::post('/register', [AuthController::class, 'register']);
// Route::get('/register', [AuthController::class, 'showForm']);


// // (Tuỳ chọn) Cho phép preflight CORS (OPTIONS) nếu FE chạy domain khác
// Route::options('/register', function (Request $request) {
//     return response('', 204);
// });
