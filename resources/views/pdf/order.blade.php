<h2>Potvrda porudžbine #{{ $order->id }}</h2>
<p>Kupac: {{ $order->user->name }}</p>
<p>Datum: {{ $order->created_at->format('d.m.Y H:i') }}</p>
<p>Status: {{ ucfirst($order->status) }}</p>

<table border="1" cellpadding="8" cellspacing="0" width="100%">
    <thead>
        <tr>
            <th>Proizvod</th>
            <th>Količina</th>
            <th>Cena</th>
            <th>Ukupno</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($order->items as $item)
            <tr>
                <td>{{ $item->product->name ?? 'Obrisano' }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ $item->price }} RSD</td>
                <td>{{ $item->price * $item->quantity }} RSD</td>
            </tr>
        @endforeach
    </tbody>
</table>

<h4 style="text-align:right">Ukupno: {{ $order->total }} RSD</h4>
