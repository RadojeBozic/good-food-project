<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Carbon\Carbon;

class AutoCompleteOrders extends Command
{
    protected $signature = 'orders:auto-complete';
    protected $description = 'Automatski završava porudžbine starije od 12h';

    public function handle()
    {
        $orders = Order::where('status', 'processed')
            ->where('created_at', '<=', Carbon::now()->subHours(12))
            ->get();

        foreach ($orders as $order) {
            $order->status = 'completed';
            $order->save();
            $this->info("Završena porudžbina #{$order->id}");
        }

        return 0;
    }
}
