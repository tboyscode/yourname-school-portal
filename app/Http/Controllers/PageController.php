<?php

namespace App\Http\Controllers;

class PageController extends Controller
{
    public function home()
    {
        $data = [
            'name' => 'Tope',
            'date' => date('l, F j, Y'),
            'isWeekend' => (date('N') >= 6),
        ];
        
        return view('welcome', $data);
    }
    
    public function about()
    {
        return view('about'); // resources/views/about.blade.php
    }
}