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
            'category_id' => 'required|exists:categories,id',
            'barcode' => 'nullable|string|max:50|unique:products,barcode',

        ]);

            if (empty($validated['barcode'])) {
                $validated['barcode'] = 'GF-' . strtoupper(uniqid());
            }


        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('products', 'public')
            : null;

        $product = Product::create([
            ...$validated,
            'image' => $imagePath,
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
        ]);

        return response()->json($product, 201);
    }

   public function index(Request $request)
{
    $query = Product::with('category')->latest();

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    if ($request->filled('barcode')) {
        $query->where('barcode', $request->barcode);
    }

    if ($request->filled('category_id')) {
        $query->where('category_id', $request->category_id);
    }

    if ($request->filled('price_min')) {
        $query->where('price', '>=', $request->price_min);
    }

    if ($request->filled('price_max')) {
        $query->where('price', '<=', $request->price_max);
    }

    return $query->get();
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
    $product = Product::findOrFail($id); // ✅ prvo dohvatimo proizvod
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
            'image' => 'nullable|mimes:jpg,jpeg,png,webp|max:2048',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'barcode' => 'nullable|string|max:50|unique:products,barcode',

        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
{
    $product = Product::findOrFail($id); // ✅ prvo dohvatimo
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
