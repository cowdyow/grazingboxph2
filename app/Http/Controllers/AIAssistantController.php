<?php

namespace App\Http\Controllers;

use App\Http\Services\AI\GeminiService;
use Illuminate\Http\Request;

class AIAssistantController extends Controller
{
    public function chat(Request $request, GeminiService $gemini)
    {
        $validated = $request->validate([
            'message' => ['required', 'string'],
        ]);

        $response = $gemini->chat(
            $validated['message']
        );

        return response()->json([
            'message' => $response,
        ]);
    }
}
