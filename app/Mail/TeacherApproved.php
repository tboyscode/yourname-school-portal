<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TeacherApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $teacher;

    public function __construct($teacher)
    {
        $this->teacher = $teacher;
    }

    public function build()
    {
        return $this->subject('Your Account Has Been Approved!')
                    ->view('emails.teacher-approved');
    }
}