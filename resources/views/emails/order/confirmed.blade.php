@component('mail::message')
# Potvrda porudžbine #{{ $order->id }}

Zahvaljujemo se na kupovini, {{ $order->user->name }}!

Porudžbina je uspešno obrađena i nalazi se u prilogu kao PDF.

**Ukupno:** {{ $order->total }} RSD  
**Datum:** {{ $order->created_at->format('d.m.Y H:i') }}

@component('mail::button', ['url' => config('app.url')])
Idi na sajt
@endcomponent

Hvala na poverenju!  
**Good-Food**
@endcomponent
