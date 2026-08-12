<?php

namespace App\Http\Services\AI;

use Exception;
use Illuminate\Support\Facades\Http;

class GeminiService
{
    private string $baseUrl =
        'https://generativelanguage.googleapis.com/v1beta/models';

    public function chat(array $messages): string
    {
        $model = config('services.gemini.model');
        $apiKey = config('services.gemini.key');

        $url = "{$this->baseUrl}/{$model}:generateContent?key={$apiKey}";

        $contents = collect($messages)
            ->map(fn ($message) => [
                'role' => $message['role'] === 'assistant'
                    ? 'model'
                    : 'user',

                'parts' => [
                    [
                        'text' => $message['content'],
                    ],
                ],
            ])
            ->values()
            ->toArray();

        $response = Http::post($url, [
            'contents' => $contents,
        ]);

        if ($response->failed()) {
            throw new Exception(
                $response->json('error.message')
                    ?? $response->body()
            );
        }

        return $response->json(
            'candidates.0.content.parts.0.text'
        );
    }
}