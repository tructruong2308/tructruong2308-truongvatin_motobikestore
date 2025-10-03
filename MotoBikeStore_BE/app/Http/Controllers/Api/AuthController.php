<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // ========== Đăng ký customer ==========
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:ntt_user,email',
            'username' => 'required|string|max:100|unique:ntt_user,username',
            'password' => 'required|string|min:6',
            'phone'    => 'required|string|max:20',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'],
            'roles'    => 'customer', // mặc định customer
            'status'   => 1,
        ]);

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    // ========== Đăng nhập customer ==========
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Sai email hoặc mật khẩu',
            ], 401);
        }

        $user = Auth::user();
        if ($user->roles !== 'customer') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản không phải là khách hàng',
            ], 403);
        }

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // ========== Đăng nhập admin ==========
    public function loginAdmin(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Sai email hoặc mật khẩu',
            ], 401);
        }

        $user = Auth::user();
        if ($user->roles !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập admin',
            ], 403);
        }

        $token = $user->createToken('admin')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập admin thành công',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // ========== Đăng xuất ==========
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đã đăng xuất']);
    }
}
