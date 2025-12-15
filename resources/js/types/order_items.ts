import { TransactionTypes } from "./transactions";

export type OrderItemTypes = {
    id: number;
    transaction_id: number;
    product_id: number;
    quantity: number;
    delivery_date: string;
    delivery_address: string;
    memo: string;
    status: string;
    created_at: string;

    product_name: string;
    transaction: TransactionTypes;
};  