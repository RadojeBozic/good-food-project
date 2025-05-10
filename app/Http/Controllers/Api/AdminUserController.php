<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminUserController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nedozvoljeno'], 403);
        }

        return User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('name')
            ->get();
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin,superadmin,procurer',
        ]);

        $authUser = auth()->user();
        if (!in_array($authUser->role, ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Nedozvoljeno'], 403);
        }

        $user = User::findOrFail($id);

        // Superadmin ne može biti degradiran
        if ($user->role === 'superadmin' && $authUser->role !== 'superadmin') {
            return response()->json(['message' => 'Ne možete menjati superadmina.'], 403);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Uloga korisnika ažurirana.', 'user' => $user]);
    }

    public function destroy($id)
{
    $authUser = auth()->user();
    if (!in_array($authUser->role, ['admin', 'superadmin'])) {
        return response()->json(['message' => 'Nedozvoljeno'], 403);
    }

    $user = User::findOrFail($id);

    if ($user->role === 'superadmin') {
        return response()->json(['message' => 'Superadmin ne može biti obrisan.'], 403);
    }

    $user->delete();

    return response()->json(['message' => 'Korisnik je uspešno obrisan.']);
}

}


