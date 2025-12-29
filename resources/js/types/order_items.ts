import { LalamoveType } from "./lalamove";
import { TransactionTypes } from "./transactions";

export type OrderItemTypes = {
    id: number;
    transaction_id: number;
    product_id: number;
    quantity: number;
    delivery_date: string;
    delivery_date_display: string;
    delivery_time: string;
    delivery_address: string;
    booking_type: string;
    memo: string;
    status: string;
    created_at: string;
    picked_up_at: string;

    product_name: string;
    transaction: TransactionTypes;
    lalamove: LalamoveType;
};  