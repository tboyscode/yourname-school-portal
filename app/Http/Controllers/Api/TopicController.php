<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    // GET ALL TOPICS (with filters)
    public function index(Request $request)
    {
        $query = Topic::with(['subject', 'teacher:id,name']);
        // with() means "also fetch the related subject and teacher"
        // This prevents the N+1 problem — look it up later!

        // Apply filters if the user sent them
        if ($request->has('class')) {
            $query->where('class', $request->class);
        }

        if ($request->has('term')) {
            $query->where('term', $request->term);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Get results, 10 per page
        $topics = $query->latest()->paginate(10);

        return response()->json($topics);
    }

    // CREATE A NEW TOPIC
    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'class' => 'required|in:JSS1, JSS2, JSS3, SS1,SS2,SS3',
            'term' => 'required|in:First Term,Second Term,Third Term',
        ]);

        $topic = Topic::create([
            'subject_id' => $request->subject_id,
            'teacher_id' => $request->user()->id, // The logged-in teacher
            'title' => $request->title,
            'content' => $request->content,
            'class' => $request->class,
            'term' => $request->term,
        ]);

        return response()->json([
            'message' => 'Topic created!',
            'topic' => $topic->load('subject', 'teacher:id,name'),
        ], 201);
    }

    // SHOW A SINGLE TOPIC
    public function show(Topic $topic)
    {
        return response()->json($topic->load('subject', 'teacher:id,name'));
    }

    // UPDATE A TOPIC
    public function update(Request $request, Topic $topic)
    {
        // Only the teacher who created it (or admin) can edit
        if ($request->user()->id !== $topic->teacher_id && !$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'class' => 'sometimes|in:SS1,SS2,SS3',
            'term' => 'sometimes|in:First Term,Second Term,Third Term',
        ]);
        // 'sometimes' means: validate only if the field is present

        $topic->update($request->only(['title', 'content', 'class', 'term', 'subject_id']));

        return response()->json([
            'message' => 'Topic updated!',
            'topic' => $topic->fresh()->load('subject', 'teacher:id,name'),
        ]);
    }

    // DELETE A TOPIC
    public function destroy(Request $request, Topic $topic)
    {
        if ($request->user()->id !== $topic->teacher_id && !$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $topic->delete();

        return response()->json(['message' => 'Topic deleted!']);
    }

    // STUDENT VIEW: Get topics for their class
    public function studentTopics(Request $request)
    {
        $user = $request->user();

        $query = Topic::with(['subject', 'teacher:id,name'])
                      ->where('class', $user->class);

        if ($request->has('term')) {
            $query->where('term', $request->term);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        return response()->json($query->latest()->paginate(10));
    }
}