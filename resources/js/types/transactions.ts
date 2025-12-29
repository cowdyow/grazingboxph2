import { CustomerType } from "./customer";
import { OrderItemTypes } from "./order_items";

export type TransactionTypes = {
    id: number;
    customer_id: number;
    order_number: string;
    status: string;
    created_at: string;
    total_amount: number;

    customer: CustomerType;
    order_items: OrderItemTypes[];
};