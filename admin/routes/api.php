<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CodesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;

// Rutas para los cursos
Route::post('/createCourse/{courseTitle}', [CourseController::class, 'createCourse']);
Route::post('/createNode', [CourseController::class, 'createNode']);
Route::post('/nodesConnection', [CourseController::class, 'nodesConnection']);
Route::post('/deleteConnections', [CourseController::class, 'deleteConnection']);
Route::post('/updateCourseTitle/{newTitle}', [CourseController::class, 'updateCourseTitle']);
Route::post('/updateNode', [CourseController::class, 'updateNode']);
Route::post('/deleteNode', [CourseController::class, 'deleteNode']);
Route::post('/getCourse', [CourseController::class, 'getCourse']);
Route::get('/validateToken/{token}', [CourseController::class, 'validateToken']);
Route::get('/getCourse/{courseId}', [CourseController::class, 'getCourseEdit']);
Route::post('/updatePositionNodes', [CourseController::class, 'updatePositionNodes']);

// Rutas usuario
Route::post('/getUserCourses', [UserController::class, 'getUserCourses']);

// Rutas Admin
Route::post('/getAdminDataAndCourses', [UserController::class, 'getAdminDataAndCourses']);

// Rutas Codigo
Route::post('/checkAccessCode', [CodesController::class, 'checkAccessCode']);
Route::get('/getUserCodes', [CodesController::class, 'getUserCodes']);
Route::post('/addAccessCode', [CodesController::class, 'addAccessCode']);
Route::post('/deleteAccessCode', [CodesController::class, 'deleteAccessCode']);
Route::post('/getCustomCodes', [CodesController::class, 'getCustomCodes']);
Route::post('/addCustomCode', [CodesController::class, 'addCustomCode']);
Route::post('/deleteCustomCode', [CodesController::class, 'deleteCustomCode']);
