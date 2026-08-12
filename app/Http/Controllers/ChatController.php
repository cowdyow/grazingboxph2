<?php

namespace App\Http\Controllers;

use App\Http\Services\ChatService;
use App\Models\Conversation;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        $conversations = Conversation::query()
            ->where('user_id', auth()->id)
            ->latest('updated_at')
            ->get();

        return inertia('chat/index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(Conversation $conversation)
    {
        /* abort_unless(
            $conversation->user_id === auth()->id(),
            403
        ); */

        $conversation->load([
            'messages' => function ($query) {
                $query->orderBy('id');
            },
        ]);

        return inertia('chat/show', [
            'conversation' => $conversation,
        ]);
    }

    public function store(Request $request)
    {
        //dd($request->all());
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $conversation = Conversation::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
        ]);

        return response()->json($conversation, 201);
    }

    public function message(
        Request $request,
        Conversation $conversation,
        ChatService $chatService,
    ) {
        /* abort_unless(
            $conversation->user_id === auth()->id(),
            403
        ); */

        $validated = $request->validate([
            'message' => ['required', 'string'],
        ]);

        $reply = $chatService->send(
            $conversation,
            $validated['message'],
        );

        $assistantMessage = $conversation->messages()
            ->where('role', 'assistant')
            ->latest('id')
            ->first();

        return response()->json([
            'message' => $assistantMessage,
        ]);
    }
}
