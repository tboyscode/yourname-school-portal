<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'department',
        'description',
    ];

    // A subject has many topics
    public function topics()
    {
        return $this->hasMany(Topic::class);
    }
}