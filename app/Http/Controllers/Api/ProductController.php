<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ProductsImport;

class ProductController extends Controller
{
    public function store(Request $request)
    {

         if (!in_array(auth()->user()->role, ['admin', 'superadmin', 'procurer'])) {
        return response()->json(['message' => 'Nemate dozvolu za dodavanje.'], 403);
    }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'image' => 'nullable|mimes:jpg,jpeg,png,webp|max:2048',
            'stock' => 'required|integer|min:0',
        ]);

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('products', 'public')
            : null;

        $product = Product::create([
            ...$validated,
            'image' => $imagePath,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($product, 201);
    }

    public function index()
    {
        return Product::latest()->get();
    }

    public function featured()
    {
        return Product::where('featured', true)->latest()->take(6)->get();
    }

    public function show($id)
    {
        return Product::findOrFail($id);
    }

    public function toggleFeatured($id)
    {

        if (auth()->id() !== $product->user_id && !in_array(auth()->user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nemate dozvolu.'], 403);
        }
        $product = Product::findOrFail($id);
        $user = auth()->user();

        if ($user->id !== $product->user_id && !in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nedozvoljeno'], 403);
        }

        $product->featured = !$product->featured;
        $product->save();

        return response()->json([
            'message' => $product->featured ? 'Proizvod je istaknut.' : 'Istaknut status je uklonjen.',
            'product' => $product
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $user = auth()->user();

        if (auth()->id() !== $product->user_id && !in_array(auth()->user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nemate dozvolu.'], 403);
        }

        if ($user->id !== $product->user_id && !in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nedozvoljeno'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {

        if (auth()->id() !== $product->user_id && !in_array(auth()->user()->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nemate dozvolu.'], 403);
        }
        $product = Product::findOrFail($id);
        $user = auth()->user();

        if ($user->id !== $product->user_id && !in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nemate dozvolu za brisanje.'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Proizvod je uspešno obrisan.']);
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

        $order = $user->orders()->create(['total' => $total]);

        foreach ($items as $item) {
            $product = Product::findOrFail($item['id']);

            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);

            $product->decrement('stock', $item['quantity']);
        }

        return response()->json(['message' => 'Porudžbina uspešno obrađena.']);
    }

    public function myOrders()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Niste prijavljeni.'], 401);
        }

        return $user->orders()
            ->with(['items.product']) // OBAVEZNO za prikaz proizvoda
            ->latest()
            ->get();
    }

    public function allOrders()
{
    return Order::with('user', 'items.product')->latest()->get();
}

public function myProducts()
{
    $user = auth()->user();

    if ($user->role !== 'procurer') {
        return response()->json(['message' => 'Nedozvoljeno'], 403);
    }

    return Product::where('user_id', $user->id)->latest()->get();
}

public function import(Request $request)
{
    if (!in_array(auth()->user()->role, ['procurer', 'admin', 'superadmin'])) {
        return response()->json(['message' => 'Nemate dozvolu.'], 403);
    }

    $request->validate([
        'file' => 'required|mimes:xlsx,xls,csv',
    ]);

    Excel::import(new ProductsImport, $request->file('file'));

    return response()->json(['message' => 'Uvoz uspešan.']);
}

}
