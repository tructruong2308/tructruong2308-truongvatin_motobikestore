<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // API Đăng ký
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:20',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công',
            'user' => $user,
        ], 201);
    }

    // API Đăng nhập
    // public function login(Request $request)
    // {
    //     $credentials = $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required|string',
    //     ]);

    //     if (Auth::attempt($credentials)) {
    //         $user = Auth::user();
    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Đăng nhập thành công',
    //             'user' => $user,
    //         ]);
    //     }

    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Sai email hoặc mật khẩu'
    //     ], 401);
    // }
}
