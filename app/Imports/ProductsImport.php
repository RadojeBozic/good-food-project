<?php

namespace App\Imports;

use App\Models\Product;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class ProductsImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        $user = auth()->user();

        foreach ($rows->skip(1) as $row) { // Pretpostavka: red 0 = zaglavlje
            Product::create([
                'name' => $row[0],
                'price' => $row[1],
                'description' => $row[2],
                'stock' => $row[3],
                'image' => $row[4] ?? null,
                'user_id' => $user->id,
            ]);
        }
    }
}

