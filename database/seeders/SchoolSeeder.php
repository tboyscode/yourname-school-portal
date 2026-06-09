<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Subject;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@school.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Mr. Johnson',
            'email' => 'teacher@school.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Tope',
            'username' => 'tope123',
            'password' => Hash::make('password'),
            'role' => 'student',
            'class' => 'SS2',
            'department' => 'Science',
            'status' => 'active',
        ]);

        $subjects = [
            ['name' => 'Mathematics', 'department' => 'General'],
            ['name' => 'English Language', 'department' => 'General'],
            ['name' => 'Civic Education', 'department' => 'General'],
            ['name' => 'Computer Studies', 'department' => 'General'],
            ['name' => 'Physics', 'department' => 'Science'],
            ['name' => 'Chemistry', 'department' => 'Science'],
            ['name' => 'Biology', 'department' => 'Science'],
            ['name' => 'Further Mathematics', 'department' => 'Science'],
            ['name' => 'Literature in English', 'department' => 'Art'],
            ['name' => 'Government', 'department' => 'Art'],
            ['name' => 'History', 'department' => 'Art'],
            ['name' => 'Accounting', 'department' => 'Commercial'],
            ['name' => 'Commerce', 'department' => 'Commercial'],
            ['name' => 'Economics', 'department' => 'Commercial'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }

        echo "Done! Admin: admin@school.com / password\n";
    }
}