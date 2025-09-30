<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id','name','email','username','phone','roles','status','created_at')
            ->orderBy('id','desc')
            ->get();

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message'=>'User not found'],404);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:ntt_user,email',
            'username' => 'required|string|unique:ntt_user,username',
            'password' => 'required|string|min:6',
            'phone'    => 'nullable|string|max:20',
            'roles'    => 'required|in:customer,admin',
            'status'   => 'nullable|integer'
        ]);
        $data['password'] = Hash::make($data['password']);
        $data['status']   = $data['status'] ?? 1;

        $user = User::create($data);
        return response()->json($user,201);
    }

    public function update(Request $request,$id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message'=>'User not found'],404);

        $data = $request->validate([
            'name'     => 'nullable|string|max:255',
            'email'    => 'nullable|email|unique:ntt_user,email,'.$id,
            'username' => 'nullable|string|unique:ntt_user,username,'.$id,
            'password' => 'nullable|string|min:6',
            'phone'    => 'nullable|string|max:20',
            'roles'    => 'nullable|in:customer,admin',
            'status'   => 'nullable|integer'
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message'=>'User not found'],404);

        $user->delete();
        return response()->json(['message'=>'Xoá thành công']);
    }

    public function lock($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message'=>'User not found'],404);

        $user->status = 0;
        $user->save();
        return response()->json(['message'=>'User đã bị khoá']);
    }

    public function unlock($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message'=>'User not found'],404);

        $user->status = 1;
        $user->save();
        return response()->json(['message'=>'User đã được mở khoá']);
    }
}
