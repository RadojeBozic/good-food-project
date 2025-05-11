<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::with('children')->whereNull('parent_id')->get();
    }

    public function withProductCount()
    {
        return Category::withCount('products')
            ->with(['children' => function ($q) {
                $q->withCount('products');
            }])
            ->whereNull('parent_id')
            ->get();
    }

}

