<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create a super admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.com',
            'username' => null,
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);
        
        // Create a teacher
        User::create([
            'name' => 'Mr. Johnson',
            'email' => 'johnson@school.com',
            'username' => null,
            'password' => Hash::make('password123'),
            'role' => 'teacher',
            'status' => 'active',
        ]);
        
        // Create a student
        User::create([
            'name' => 'Tope Student',
            'email' => null,
            'username' => 'tope123',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'class' => 'SS2',
            'department' => 'Science',
            'status' => 'active',
        ]);
    }
}