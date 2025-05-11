<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'Zdrava hrana' => [
                'Voće i povrće',
                'Mahunarke i žitarice',
                'Mlečni proizvodi (eko)',
                'Jaja i biljni proteini',
                'Organska testenina i brašno',
            ],
            'Eko i bio proizvodi' => [
                'Organska ulja i masti',
                'Bio slatkiši i grickalice',
                'Bezglutenski proizvodi',
                'Veganski proizvodi',
                'Prirodni sokovi i napici',
            ],
            'Dodaci ishrani' => [
                'Vitamini i minerali',
                'Probiotici i enzimi',
                'Imunološki suplementi',
                'Omega-3, kolagen, Q10',
                'Biljni suplementi',
            ],
            'Prirodni proizvodi' => [
                'Med i proizvodi od meda',
                'Čajevi i biljne mešavine',
                'Suvo voće i semenke',
                'Biljni ekstrakti i sirupi',
            ],
            'Specijalni režimi' => [
                'Keto proizvodi',
                'Dijabetičarski proizvodi',
                'Proteinske grickalice i zamene za obrok',
                'Funkcionalna pića',
            ],
        ];

        foreach ($data as $main => $children) {
            $parent = Category::create(['name' => $main, 'parent_id' => null]);
            foreach ($children as $child) {
                Category::create(['name' => $child, 'parent_id' => $parent->id]);
            }
        }
    }
}
