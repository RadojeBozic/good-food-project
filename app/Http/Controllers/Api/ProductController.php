<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',           
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);
    
        $imagePath = null;
    
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }
    
        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'image' => $imagePath,
            'user_id' => $request->user()->id,
        ]);
    
        return response()->json($product, 201);
    }
    

public function index()
{
    return Product::latest()->get(); // ili paginacija kasnije
}

public function toggleFeatured($id)
{
    $product = Product::findOrFail($id);

    // dozvoljeno samo autoru ili adminu/superadminu
    if (auth()->id() !== $product->user_id && !in_array(auth()->user()->role, ['admin', 'superadmin'])) {
        return response()->json(['message' => 'Nedozvoljeno'], 403);
    }

    $product->featured = !$product->featured;
    $product->save();

    return response()->json([
        'message' => $product->featured ? 'Proizvod je istaknut.' : 'Istaknut status je uklonjen.',
        'product' => $product
    ]);
}

public function featured()
{
    return Product::where('featured', true)->latest()->take(6)->get();
}

public function show($id)
{
    return Product::findOrFail($id);
}

public function update(Request $request, $id)
{
    $product = Product::findOrFail($id);
    
    if (!auth()->check()) {
        return response()->json(['message' => 'Nije prijavljen korisnik.'], 401);
    }
    if (auth()->id() !== $product->user_id && !in_array(auth()->user()->role, ['admin', 'superadmin'])) {
        return response()->json(['message' => 'Nedozvoljeno'], 403);
    }

    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'required|string',
        'image' => 'nullable|string',
    ]);

    $product->update([
        'name' => $request->name,
        'price' => $request->price,
        'description' => $request->description,
        'image' => $request->image,
    ]);

    return response()->json($product);
}


}
