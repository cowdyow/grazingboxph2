<?php

namespace App\Http\Services;

use App\Http\Services\AI\GeminiService;
use App\Http\Services\AI\OrderParserService;
use App\Models\ChatMessage;
use App\Models\Conversation;


class ChatService
{
    public function __construct(
        private GeminiService $gemini,
        private OrderParserService $orderParser,
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

        /*
        |--------------------------------------------------------------------------
        | TEMPORARY: Detect order messages
        |--------------------------------------------------------------------------
        */

        if ($this->looksLikeOrder($message)) {

            $order = $this->orderParser->parse($message);

            $reply = json_encode(
                $order,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
            );
        } else {

            /*
            |--------------------------------------------------------------------------
            | Normal chatbot
            |--------------------------------------------------------------------------
            */

            $messages = $conversation->messages()
                ->orderBy('id')
                ->get()
                ->map(fn (ChatMessage $message) => [
                    'role' => $message->role,
                    'content' => $message->message,
                ])
                ->toArray();

            $reply = $this->gemini->chat($messages);
        }

        // Save AI response
        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'assistant',
            'message' => $reply,
        ]);

        return $reply;
    }

    private function looksLikeOrder(string $message): bool
    {
        $keywords = [
            'contact name',
            'contact number',
            'delivery address',
            'number of boxes',
            'date of delivery',
            'size/s',
        ];

        $message = strtolower($message);

        $matches = 0;

        foreach ($keywords as $keyword) {
            if (str_contains($message, $keyword)) {
                $matches++;
            }
        }

        return $matches >= 2;
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