<?php

//API-Only Project

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


