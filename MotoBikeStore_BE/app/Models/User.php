<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'ntt_user'; // ✅ bảng thật trong DB

    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'phone',
        'roles',
        'status',
        'address',
        'avatar',
        'created_by',
        'updated_by',
        'deleted_at',
    ];

    protected $hidden = ['password', 'remember_token'];
}
