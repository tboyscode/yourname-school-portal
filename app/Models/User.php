<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name', 'email', 'username', 'password', 'role',
        'class', 'department', 'status',
        'two_factor_code', 'two_factor_expires_at',
    ];

    protected $hidden = [
        'password', 'remember_token', 'two_factor_code',
    ];

    protected function casts(): array
    {
        return [
            'two_factor_expires_at' => 'datetime',
        ];
    }

    public function topics()
    {
        return $this->hasMany(Topic::class, 'teacher_id');
    }

    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    public function isTeacher()
    {
        return $this->role === 'teacher';
    }

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function getSubjects()
    {
        return Subject::where('department', $this->department)
                      ->orWhere('department', 'General')
                      ->get();
    }
}