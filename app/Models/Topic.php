<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Topic extends Model
{
    use SoftDeletes;

    protected $fillable = [
    'subject_id',
    'teacher_id',
    'title',
    'content',
    'file_path',
    'file_name',
    'file_type',
    'class',
    'term',
];

    // A topic belongs to a subject
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // A topic belongs to a teacher
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}