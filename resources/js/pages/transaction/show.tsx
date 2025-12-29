import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";
import { OrderItemTypes } from "@/types/order_items";
import { TransactionTypes } from "@/types/transactions";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import EditOrderItem from "./components/edit-order-item";

type Props = {
    transaction: {
        data: TransactionTypes;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: dashboard().url,
    },
];

const Show: React.FC<Props> = ({ transaction }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transaction #${transaction.data.order_number}`} />

            {/* Transaction Header */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Transaction Details - #{transaction.data.order_number}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Name</Label>
                            <div className="font-medium">{transaction.data.customer.name}</div>
                        </div>
                        <div>
                            <Label>Username</Label>
                            <div className="font-medium">{transaction.data.customer.username}</div>
                        </div>
                        <div>
                            <Label>Address</Label>
                            <div className="font-medium">{transaction.data.customer.address}</div>
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <div className="font-medium">{transaction.data.customer.phone}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Items */}
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transaction.data.order_items &&
                    transaction.data.order_items.map((item: OrderItemTypes, index: number) => (
                        <Card key={index} className="border shadow-sm hover:shadow-md transition p-4">
                            <CardContent className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">{item.product_name}</h3>
                                    <div className="inline-flex gap-2">
                                    <Badge
                                        className={`${
                                            item.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : item.status === "pending"
                                                ? "bg-gray-100 text-gray-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </Badge>
                                    <EditOrderItem orderItem={item} />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-300">
                                    <p>
                                        <span className="font-medium">Quantity:</span> {item.quantity}
                                    </p>
                                    <p>
                                        <span className="font-medium">Delivery Date:</span>{" "}
                                        {new Date(item.delivery_date).toLocaleString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                    <p>
                                        <span className="font-medium">Delivery Address:</span>{" "}
                                        {item.delivery_address}
                                    </p>
                                    <p> <span className="font-medium">Booking Type:</span>{" "}{item.booking_type}</p>
                                    {item.memo && (
                                        <p>
                                            <span className="font-medium">Memo:</span> <blockquote className="mt-6 border-l-2 pl-6 italic">{item.memo}</blockquote>
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </AppLayout>
    );
};

export default Show;
