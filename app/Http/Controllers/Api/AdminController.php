<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_teachers' => User::where('role', 'teacher')->count(),
            'total_students' => User::where('role', 'student')->count(),
            'pending_teachers' => User::where('role', 'teacher')->where('status', 'pending')->count(),
            'total_subjects' => Subject::count(),
        ]);
    }

    public function approveTeacher($id)
{
    $teacher = User::where('role', 'teacher')->findOrFail($id);
    $teacher->status = 'active';
    $teacher->save();

    // Send approval email
    try {
        \Mail::to($teacher->email)->send(new \App\Mail\TeacherApproved($teacher));
    } catch (\Exception $e) {
        // Email failed but teacher is still approved
    }

    return response()->json(['message' => 'Teacher approved successfully!']);
}

    public function teachers(Request $request)
    {
        $query = User::where('role', 'teacher');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function students(Request $request)
    {
        $query = User::where('role', 'student');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('username', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('class')) {
            $query->where('class', $request->class);
        }

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function storeTeacher(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        $teacher = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teacher',
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Teacher created successfully!',
            'teacher' => $teacher,
        ], 201);
    }

    public function storeStudent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|min:8',
            'class' => 'required|in:JSS1, JSS2, JSS3, SS1,SS2,SS3',
            'department' => 'required|in:Science,Art,Commercial',
        ]);

        $student = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'student',
            'class' => $request->class,
            'department' => $request->department,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Student created successfully!',
            'student' => $student,
        ], 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent admin from modifying their own account
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot modify your own account for security reasons.'
            ], 403);
        }

        // Only allow specific fields to be updated
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'username' => 'sometimes|string|unique:users,username,' . $id,
            'class' => 'sometimes|in:SS1,SS2,SS3',
            'department' => 'sometimes|in:Science,Art,Commercial',
            'status' => 'sometimes|in:active,inactive',
        ]);

        // Never allow role changes
        $user->update($request->only([
            'name', 'email', 'username', 'class', 'department', 'status'
        ]));

        return response()->json([
            'message' => 'User updated successfully!',
            'user' => $user,
        ]);
    }

    public function deleteUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent admin from deleting themselves
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.'
            ], 403);
        }

        // Prevent deleting the last super admin
        if ($user->isSuperAdmin() && User::where('role', 'super_admin')->count() <= 1) {
            return response()->json([
                'message' => 'Cannot delete the last super admin account.'
            ], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully!']);
    }

    public function subjects()
    {
        return response()->json(Subject::orderBy('department')->orderBy('name')->get());
    }

    public function storeSubject(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'department' => 'required|in:General,Science,Art,Commercial',
        'description' => 'nullable|string|max:500',
    ]);

    // Check for duplicate
    $exists = Subject::where('name', $request->name)
                     ->where('department', $request->department)
                     ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'This subject already exists in the ' . $request->department . ' department.'
        ], 422);
    }

    $subject = Subject::create($request->all());

    return response()->json([
        'message' => 'Subject created successfully!',
        'subject' => $subject,
    ], 201);
}

    public function updateSubject(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255|unique:subjects,name,' . $id,
            'department' => 'sometimes|in:General,Science,Art,Commercial',
            'description' => 'nullable|string|max:500',
        ]);

        $subject->update($request->all());

        return response()->json([
            'message' => 'Subject updated successfully!',
            'subject' => $subject,
        ]);
    }

    public function deleteSubject($id)
    {
        $subject = Subject::findOrFail($id);

        // Check if topics exist for this subject
        if ($subject->topics()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete subject with existing topics. Delete the topics first.'
            ], 422);
        }

        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully!']);
    }
}