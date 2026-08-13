<?php

namespace App\Http\Services\AI;

use App\Http\Services\AI\GeminiService;

class OrderParserService
{
    public function __construct(
        private GeminiService $gemini,
    ) {
    }

    public function parse(string $message): array
    {
        $prompt = <<<PROMPT
You are an order extraction assistant for GrazingBoxPH.

Extract the order information from the customer's message.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

Use this exact structure:

{
    "customer": {
        "name": null,
        "contact_number": null
    },
    "orders": [
        {
            "product_name": null,
            "quantity": null,
            "delivery_date": null,
            "delivery_address": null,
            "dedication": null
        }
    ],
    "delivery_method": null,
    "pickup_location": null
}

Rules:

- Extract the customer's name.
- Extract the contact number.
- Extract every product/order mentioned.
- "Size/s" refers to the product name.
- "Number of boxes" refers to quantity.
- Convert dates into YYYY-MM-DD.
- The current date is 2026-08-13.
- Do not invent missing information.
- Use null when information is not provided.
- Keep product_name exactly as written by the customer.
- Keep the dedication exactly as provided.
- Return an array under "orders" because a customer may order multiple products.

Customer message:

$message
PROMPT;

        $response = $this->gemini->chat([
            [
                'role' => 'user',
                'content' => $prompt,
            ],
        ]);

        return $this->decodeJson($response);
    }

    private function decodeJson(string $response): array
    {
        $response = trim($response);

        // In case Gemini accidentally wraps the JSON
        // in ```json ... ```
        $response = preg_replace(
            '/^```json\s*|\s*```$/i',
            '',
            $response
        );

        return json_decode(
            trim($response),
            true,
            512,
            JSON_THROW_ON_ERROR
        );
    }
}