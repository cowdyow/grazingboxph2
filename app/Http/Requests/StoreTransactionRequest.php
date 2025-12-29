<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            /*  'customer_id' => 'required', */
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.delivery_date' => 'required|date',

            'items.*.booking_type' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'The customer field is required.',
            'items.*.delivery_date.required' => 'The delivery date field is required.',
            'items.*.delivery_address.required' => 'The delivery address field is required.',
            'items.*.product_id.required' => 'Please select a product.',
            'items.*.quantity.required' => 'The quantity field is required.',
            'items.*.booking_type.required' => 'The booking type field is required.',
        ];
    }
}
