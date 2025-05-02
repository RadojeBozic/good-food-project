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
            'stock' => 'required|integer|min:0',
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
            'stock' => $request->stock,

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

/* public function update(Request $request, $id)
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
 */

 public function update(Request $request, $id)
{
    if (!auth()->check()) {
        return response()->json(['message' => 'Nije prijavljen korisnik.'], 401);
    }

    $product = Product::findOrFail($id);

    if (auth()->id() !== $product->user_id && !in_array(auth()->user()->role, ['admin', 'superadmin'])) {
        return response()->json(['message' => 'Nedozvoljeno'], 403);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'required|string',
        'image' => 'nullable|string',
        'stock' => 'required|integer|min:0',

    ]);

    // Ručno postavljanje vrednosti
    $product->name = $validated['name'];
    $product->price = $validated['price'];
    $product->description = $validated['description'];
    $product->image = $validated['image'] ?? $product->image;
    $product->stock = $validated['stock'];


    $product->save();

    return response()->json($product);
}

public function checkout(Request $request)
{
    $user = auth()->user();
    $items = $request->input('cart');

    $total = 0;
    foreach ($items as $item) {
        $product = Product::findOrFail($item['id']);
        if ($product->stock < $item['quantity']) {
            return response()->json(['message' => "Nema dovoljno zaliha za {$product->name}"], 400);
        }
        $total += $product->price * $item['quantity'];
    }
    
    // 1. Kreiraj Order
    $order = $user->orders()->create(['total' => $total]);
    
    // 2. Dodaj stavke i smanji stock
    foreach ($items as $item) {
        $product = Product::findOrFail($item['id']);
        $order->items()->create([
            'product_id' => $product->id,
            'quantity' => $item['quantity'],
            'price' => $product->price,
        ]);
        $product->stock -= $item['quantity'];
        $product->save();
    }
    

    return response()->json(['message' => 'Porudžbina uspešno obrađena.']);
}


public function destroy($id)
{
    if (!auth()->check()) {
        return response()->json(['message' => 'Niste prijavljeni.'], 401);
    }

    $product = Product::findOrFail($id);
    $user = auth()->user();

    if ($user->id !== $product->user_id && !in_array($user->role, ['admin', 'superadmin'])) {
        return response()->json(['message' => 'Nemate dozvolu za brisanje.'], 403);
    }

    $product->delete();

    return response()->json(['message' => 'Proizvod je uspešno obrisan.']);
}

public function myOrders()
{
    return auth()->user()->orders()->with(['items' => fn($q) => $q->whereHas('product')])
    ->latest()->get();
}




}
