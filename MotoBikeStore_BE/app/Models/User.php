<?php   
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;

    // Nếu dùng bảng mặc định:
    protected $table = 'users';

    // Nếu dùng bảng custom, bỏ dòng trên và dùng:
    // protected $table = 'nqtv_user';

    protected $fillable = ['name','email','password','phone'];
    protected $hidden = ['password'];
}
