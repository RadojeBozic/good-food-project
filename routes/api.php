<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;


Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Proizvodi
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::put('/products/{id}/toggle-featured', [ProductController::class, 'toggleFeatured']);
    Route::get('/my-products', [ProductController::class, 'myProducts']);
    Route::post('/import-products', [\App\Http\Controllers\Api\ProductController::class, 'import'])
    ->middleware('auth:sanctum');



    // Korpa i porudžbine
    Route::post('/checkout', [ProductController::class, 'checkout']);
    Route::get('/my-orders', [ProductController::class, 'myOrders']);

    // Admin deo
    Route::get('/admin/orders', [\App\Http\Controllers\Api\AdminOrderController::class, 'index']);
    Route::patch('/admin/orders/{id}/status', [\App\Http\Controllers\Api\AdminOrderController::class, 'updateStatus']);
    Route::get('/admin/users', [\App\Http\Controllers\Api\AdminUserController::class, 'index']);
    Route::patch('/admin/users/{id}/role', [\App\Http\Controllers\Api\AdminUserController::class, 'updateRole']);
    Route::delete('/admin/users/{id}', [\App\Http\Controllers\Api\AdminUserController::class, 'destroy']);


});


    // Javno dostupne rute
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
    Route::get('/categories-with-count', [\App\Http\Controllers\Api\CategoryController::class, 'withProductCount']);


    Route::get('/me', function () {
        return auth()->user();
});
    Route::post('/stripe/checkout', [\App\Http\Controllers\Api\StripeController::class, 'checkout']);



