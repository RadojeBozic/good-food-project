<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // SuperAdmin
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@goodfood.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
        ]);

        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@goodfood.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Agent
        User::create([
            'name' => 'Agent User',
            'email' => 'agent@goodfood.com',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);
    }
}
