<?php

use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

Route::resource('tasks', TaskController::class)->only(['index', 'store', 'update', 'destroy']);
