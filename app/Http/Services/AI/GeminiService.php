<?php

namespace App\Http\Services\AI;

use Gemini\Laravel\Facades\Gemini;

class GeminiService
{
    public function chat(string $message): string
    {
        $response = Gemini::generativeModel(
            model: config('services.gemini.model')
        )->generateContent($message);

        return $response->text();
    }
}