<?php

namespace App\Http\Services;

use App\Http\Services\AI\GeminiService;
use App\Models\ChatMessage;
use App\Models\Conversation;

class ChatService
{
    public function __construct(
        private GeminiService $gemini,
    ) {
    }

    public function send(
        Conversation $conversation,
        string $message
    ): string {
        // Save user's message
        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'user',
            'message' => $message,
        ]);

        // Get this conversation's history
        $messages = $conversation->messages()
            ->orderBy('id')
            ->get()
            ->map(fn (ChatMessage $message) => [
                'role' => $message->role,
                'content' => $message->message,
            ])
            ->toArray();

        // Send conversation history to Gemini
        $reply = $this->gemini->chat($messages);

        // Save AI response
        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'assistant',
            'message' => $reply,
        ]);

        return $reply;
    }

    public function history(Conversation $conversation)
    {
        return $conversation->messages()
            ->orderBy('id')
            ->get();
    }

    public function clear(Conversation $conversation): void
    {
        $conversation->messages()->delete();
    }
}