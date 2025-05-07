<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use App\Mail\OrderConfirmed;
use Illuminate\Support\Facades\Mail;

class AdminOrderController extends Controller
{
    public function index(Request $request)
{
    $user = auth()->user();
    if (!in_array($user->role, ['admin', 'superadmin'])) {
        return response()->json(['message' => 'Nedozvoljeno'], 403);
    }

    $query = Order::with(['user', 'items.product'])->latest();

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    if ($request->has('user_id')) {
        $query->where('user_id', $request->user_id);
    }

    return $query->get();
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

            // ✅ Ako je status završen – generiši PDF
        if ($order->status === 'completed') {
            $pdf = Pdf::loadView('pdf.order', ['order' => $order]);
            $pdfPath = "pdf/porudzbina-{$order->id}.pdf";
            Storage::disk('public')->put($pdfPath, $pdf->output());
        }

        // ✅ Ako je status završen – pošalji email
        if ($order->status === 'completed') {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.order', ['order' => $order]);
            $pdfPath = "pdf/porudzbina-{$order->id}.pdf";
            \Storage::disk('public')->put($pdfPath, $pdf->output());
        
            // 📧 Pošalji mejl korisniku
            Mail::to($order->user->email)->send(new OrderConfirmed($order, $pdfPath));
        }
        

        return response()->json([
            'message' => 'Status porudžbine ažuriran.',
            'order' => $order,
        ]);
    }
}
