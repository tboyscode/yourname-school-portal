<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function teacherRegister(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teacher',
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Registration successful! Wait for admin approval.',
        ], 201);
    }

    public function studentRegister(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|min:8|confirmed',
            'class' => 'required|in:JSS1,JSS2,JSS3,SS1,SS2,SS3',            'department' => 'required|in:Science,Art,Commercial',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'student',
            'class' => $request->class,
            'department' => $request->department,
            'status' => 'active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful!',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        // Check for too many failed attempts
        $throttleKey = 'login_attempts_' . $request->ip();
        $attempts = cache()->get($throttleKey, 0);

        if ($attempts >= 5) {
            return response()->json([
                'message' => 'Too many login attempts. Please try again in 15 minutes.'
            ], 429);
        }

        $field = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($field, $request->login)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Increment failed attempts
            cache()->put($throttleKey, $attempts + 1, now()->addMinutes(15));

            throw ValidationException::withMessages([
                'login' => ['Incorrect credentials.'],
            ]);
        }

        // Clear failed attempts on successful login
        cache()->forget($throttleKey);

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your account is ' . $user->status . '. Contact admin.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully!',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function sendTwoFactorCode(Request $request)
    {
        $user = $request->user();

        $user->two_factor_code = rand(100000, 999999);
        $user->two_factor_expires_at = now()->addMinutes(10);
        $user->save();

        return response()->json([
            'message' => 'Verification code generated!',
            'code' => $user->two_factor_code,
            'expires_at' => $user->two_factor_expires_at,
        ]);
    }

    public function updateEmail(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
            'new_email' => 'required|email|unique:users,email',
        ]);

        $user = $request->user();

        if ($user->two_factor_code !== $request->code) {
            return response()->json(['message' => 'Invalid code!'], 422);
        }

        if ($user->two_factor_expires_at < now()) {
            return response()->json(['message' => 'Code has expired!'], 422);
        }

        $user->email = $request->new_email;
        $user->two_factor_code = null;
        $user->two_factor_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Email updated successfully!',
            'user' => $user,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
            'current_password' => 'required|string',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is wrong!'], 422);
        }

        if ($user->two_factor_code !== $request->code) {
            return response()->json(['message' => 'Invalid code!'], 422);
        }

        if ($user->two_factor_expires_at < now()) {
            return response()->json(['message' => 'Code has expired!'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->two_factor_code = null;
        $user->two_factor_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully!',
        ]);
    }
}