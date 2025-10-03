<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| Public APIs
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
// Admin
Route::post('/admin/login', [AuthController::class, 'loginAdmin']); 

// Products (public)
Route::get('/products',      [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Categories (public)
Route::get('/categories',              [CategoryController::class, 'index']);
Route::get('/categories/{id}',         [CategoryController::class, 'show']);
Route::get('/categories/{id}/products',[CategoryController::class, 'products']);

/*
|--------------------------------------------------------------------------
| Protected APIs (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout',   [AuthController::class, 'logout']);

    // Orders
    Route::post('/checkout',             [OrderController::class, 'checkout']);
    Route::get('/orders',                [OrderController::class, 'index']);
    Route::get('/orders/{id}',           [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status',  [OrderController::class, 'updateStatus']);

    // Category CRUD
    Route::post('/categories',           [CategoryController::class, 'store']);
    Route::put('/categories/{id}',       [CategoryController::class, 'update']);
    Route::delete('/categories/{id}',    [CategoryController::class, 'destroy']);

    // User CRUD
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/lock', [UserController::class, 'lock']);
    Route::post('/users/{id}/unlock', [UserController::class, 'unlock']);
});

Route::fallback(function () {
    return response()->json(['message' => 'Endpoint not found'], 404);
});
