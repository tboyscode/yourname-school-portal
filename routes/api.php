<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// PUBLIC ROUTES (No login required)
Route::post('/teacher/register', [AuthController::class, 'teacherRegister']);
Route::post('/student/register', [AuthController::class, 'studentRegister']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1'); // Max 5 attempts per minute

// PROTECTED ROUTES (Must be logged in)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/send-2fa', [AuthController::class, 'sendTwoFactorCode'])->middleware('throttle:3,10');
    Route::put('/update-email', [AuthController::class, 'updateEmail']);
    Route::put('/update-password', [AuthController::class, 'updatePassword']);

    // Topics - Teachers only (except view)
    Route::get('/topics', [TopicController::class, 'index']); // All authenticated users
    Route::get('/topics/{topic}', [TopicController::class, 'show']); // All authenticated users
    Route::post('/topics', [TopicController::class, 'store'])->middleware('role:teacher,super_admin');
    Route::put('/topics/{topic}', [TopicController::class, 'update'])->middleware('role:teacher,super_admin');
    Route::delete('/topics/{topic}', [TopicController::class, 'destroy'])->middleware('role:teacher,super_admin');
    
    // Student routes
    Route::get('/student/topics', [TopicController::class, 'studentTopics'])->middleware('role:student');
    Route::get('/student/subjects', function (Request $request) {
        return response()->json($request->user()->getSubjects());
    })->middleware('role:student');

    // Subjects list for topic creation (teachers and admins can access)
    Route::get('/subjects', function () {
        return response()->json(\App\Models\Subject::orderBy('department')->orderBy('name')->get());
    });

    // Admin routes
    Route::middleware('role:super_admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/teachers', [AdminController::class, 'teachers']);
        Route::post('/teachers', [AdminController::class, 'storeTeacher']);
        Route::put('/teachers/{id}/approve', [AdminController::class, 'approveTeacher']);
        Route::get('/students', [AdminController::class, 'students']);
        Route::post('/students', [AdminController::class, 'storeStudent']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/subjects', [AdminController::class, 'subjects']);
        Route::post('/subjects', [AdminController::class, 'storeSubject']);
        Route::put('/subjects/{id}', [AdminController::class, 'updateSubject']);
        Route::delete('/subjects/{id}', [AdminController::class, 'deleteSubject']);
    });
});