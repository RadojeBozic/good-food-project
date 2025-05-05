<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class AdminOrderController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nedozvoljeno'], 403);
        }

        $orders = Order::with(['user', 'items.product'])->latest()->get();

        return response()->json($orders);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = auth()->user();

        if (!in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nedozvoljeno'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,processed,completed',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Status porudžbine ažuriran.',
            'order' => $order,
        ]);
    }
}
