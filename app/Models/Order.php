<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total',
        'status',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Lokalizovani naziv statusa (opciono)
    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'pending' => 'Na čekanju',
            'processed' => 'U obradi',
            'completed' => 'Završeno',
            default => ucfirst($this->status),
        };
    }
}
