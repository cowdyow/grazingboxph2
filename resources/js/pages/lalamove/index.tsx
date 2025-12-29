import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AddLalamoveRider from "./components/add-rider";
import { LalamoveType } from "@/types/lalamove";
import { Badge } from "@/components/ui/badge";
import EditLalamoveRider from "./components/edit-rider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { OrderItemTypes } from "@/types/order_items";
import transactions from "@/routes/transactions";
import CustomerDetail from "./components/customer-detail";
import { BookingTypeBadge } from "@/components/custom/booking-type-badge";

type Props = {

    orders: {
        data: OrderItemTypes[];
    }
    productCounts: {
        product_id: number,
        product_name: string,
        total_quantity: string,
        completed_quantity: string,
    }
    date: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: dashboard().url,
    },
];

const statusMap: Record<
    string,
    { label: string; className: string }
> = {
    pending: {
        label: "Not Yet Started",
        className: "bg-gray-100 text-gray-800",
    },
    "in-progress": {
        label: "Preparing",
        className: "bg-yellow-100 text-yellow-800",
    },
    ready: {
        label: "Ready",
        className: "bg-blue-100 text-blue-800",
    },
    completed: {
        label: "Completed",
        className: "bg-green-100 text-green-800",
    },
};

const bookingTypeMap: Record<
    string,
    { label: string; className: string }
> = {
    pickup: {
        label: "Pick Up",
        className: "bg-yellow-100 text-yellow-800",
    },
    customer_booked: {
        label: "Customer Will Book",
        className: "bg-blue-100 text-blue-800",
    },
    staff_booked: {
        label: "I Will Book",
        className: "bg-green-100 text-green-800",
    },
};


const LalamovePage: React.FC<Props> = ({ orders, productCounts, date }) => {
const { props } = usePage();
const [search, setSearch] = useState("");
const [selectedDate, setSelectedDate] = useState<string>(date);

const handleSearch = () => {
    router.get(route("lalamove.index"), { search, date: selectedDate }, {
        preserveState: true,
        replace: true,
    });
};
const handleReset = () => {
    setSearch("");


    const params = new URLSearchParams(window.location.search);
    const currentDate = params.get("date") || new Date().toISOString().split("T")[0];

    setSelectedDate(currentDate);

    router.get(
        route("lalamove.index"),
        { date: currentDate, search: "" },
        { preserveState: true }
    );
};


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lalamove Riders" />
            
            <div className="">
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        const date = e.target.value; // "YYYY-MM-DD"
                        setSelectedDate(date);       // update state
                        router.get(route("lalamove.index"), { date, search }, {
                            preserveState: true,
                            replace: true,
                        });
                    }}
                    className="w-auto mb-4"
                />

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 pb-4">
                    {productCounts.map((product) => {
                        const remaining = product.total_quantity - product.completed_quantity;
                        return (
                            <Card
                                key={product.product_id}
                                className={`p-4 ${remaining === 0 ? "bg-green-700 border-green-500" : ""}`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">{product.product_name}</h3>
                                    <div className="text-lg font-bold">{product.completed_quantity} / {product.total_quantity}</div>
                                </div>
                                <div className="text-sm text-gray-300">REMAINING: {remaining}</div>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <div className="flex sm:flex-row flex-col sm:justify-between  items-center sm:items-start pb-4 gap-4 sm:gap-0">
                        <CardTitle className="px-6 ">
                            <div className="inline-flex gap-2 text-lg font-bold">
                                Orders for <p className="underline">{new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}</p>
                            </div>
                        </CardTitle>
                        <div className="flex gap-2 items-center mr-4">
                            <Input
                                placeholder="Search Customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full"
                            />
                            <Button onClick={() => handleSearch()} type="button">Search</Button>
                            <Button onClick={handleReset} variant="secondary" type="button">Reset</Button>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Delivery Time & Address</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Lalamove</TableHead>
                                    <TableHead>Link</TableHead>
                                    
                                    <TableHead />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {orders.data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                            <BookingTypeBadge type={item.booking_type} />
                                            <Link href={transactions.show(item.transaction_id).url}>
                                            <div className="text-blue-500">{item.transaction.order_number}</div>
                                            </Link>
                                            </div>
                                            </TableCell>
                                        <TableCell><CustomerDetail customer={item.transaction.customer}/></TableCell>
                                        <TableCell>{item.quantity} - {item.product_name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div>{item.delivery_time}</div>
                                                <div className="text-xs text-gray-400 max-w-[200px] whitespace-normal break-words">
                                                {item.delivery_address}
                                                </div>

                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <select
                                                value={item.status}
                                                onChange={(e) => {
                                                const newStatus = e.target.value;
                                                router.put(route("lalamove.updateStatus", item.id), {
                                                    status: newStatus,
                                                }, {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                    // optionally show a toast or refresh the table
                                                    },
                                                });
                                                }}
                                                className={`px-2 py-1 rounded ${
                                                statusMap[item.status]?.className || "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {Object.entries(statusMap).map(([key, status]) => (
                                                <option key={key} value={key}>
                                                    {status.label}
                                                </option>
                                                ))}
                                            </select>
                                        </TableCell>


                                        <TableCell className="max-w-[250px] whitespace-normal break-words">
                                            {item.memo}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                            <div>{item.lalamove && (item.lalamove.contact_no)}</div>
                                            <div className="text-xs text-gray-400">{item.lalamove && (item.lalamove.rider_name)}</div>
                                            </div>
                                            </TableCell>
                                        
                                        <TableCell>
                                            {item.lalamove && (item.lalamove.memo && (
                                                <a
                                                    href={item.lalamove.memo}
                                                    className="text-blue-600 underline"
                                                    target="_blank"
                                                >
                                                    Link
                                                </a>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <EditLalamoveRider order={item} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default LalamovePage;
