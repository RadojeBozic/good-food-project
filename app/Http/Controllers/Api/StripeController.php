<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeController extends Controller
{
    public function checkout(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $lineItems = array_map(function ($item) {
            return [
                'price_data' => [
                    'currency' => 'rsd',
                    'product_data' => [
                        'name' => $item['name'],
                    ],
                    'unit_amount' => $item['price'] * 100, // Stripe traži cenu u lipama
                ],
                'quantity' => $item['quantity'],
            ];
        }, $request->input('cart'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => config('app.url') . '/success',
            'cancel_url' => config('app.url') . '/cancel',
        ]);

        return response()->json(['url' => $session->url]);
    }
}

