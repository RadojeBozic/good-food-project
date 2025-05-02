<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Zaštićene rute za proizvode
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}/toggle-featured', [ProductController::class, 'toggleFeatured']);
    // Dodajemo i edit/update/delete kasnije
});

// Javno dostupne rute
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/products/{id}', [ProductController::class, 'update']); // sad je zaštićeno
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // sve ostale admin rute...
});

Route::get('/me', function () {
    return auth()->user();
});

