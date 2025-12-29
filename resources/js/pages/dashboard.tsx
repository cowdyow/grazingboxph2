import AddOrder from '@/components/dashboard/add-order';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { TransactionTypes } from '@/types/transactions';
import { OrderItemTypes } from '@/types/order_items';
import { useState } from 'react';
import OrderDetails from '@/components/dashboard/order-details';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    orderItems: {
        data: OrderItemTypes[];
    };
    dashboardCount: {
        totalOrders: string;
        totalBoxes: string;
        products: {
            product_id: number;
            product_name: string;
            total_quantity: string;
        }
    }
};

    
export default function Dashboard({ orderItems, dashboardCount }: Props) {
    const events = orderItems.data.map(item => ({
        id: String(item.id),
        title: `${item.quantity} - ${item.product_name} ${item.status}`,
        date: item.delivery_date,
    }));

    const [selectedOrder, setSelectedOrder] = useState<OrderItemTypes | null>(null);
    const [open, setOpen] = useState(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className='flex justify-between items-center'>
                <div></div>
                <AddOrder />
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
                    {/* Card 1: Total Transactions */}
                    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Transactions This Month</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{dashboardCount.totalOrders}</p>
                    </div>

                    {/* Card 2: Total Boxes + Products */}
                    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Boxes: {dashboardCount.totalBoxes}</h3>
                        <div className="mt-4 space-y-2">
                        {dashboardCount.products.map((product) => (
                            <div
                            key={product.product_id}
                            className={`p-2 rounded-lg flex justify-between items-center border ${
                                product.total_quantity === 0
                                ? "bg-green-100 dark:bg-green-800 border-green-400"
                                : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            }`}
                            >
                            <span className="text-gray-700 dark:text-gray-200">{product.product_name}</span>
                            <span className="text-gray-900 dark:text-white font-bold">{product.total_quantity}</span>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Card 3: Sales */}
                    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Sales</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">—</p>
                    </div>
                </div>

                {/* <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div> */}
                <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
                dateClick={(info) => {
                    const clickedDate = info.dateStr; // e.g. "2025-12-29"
                    router.get(route("lalamove.index"), { date: clickedDate }, {
                    preserveState: true,
                    replace: true,
                    });
                }}
                eventClick={(info) => {
                    const orderId = Number(info.event.id);
                    const order = orderItems.data.find(item => item.id === orderId);
                    if (!order) return;

                    setSelectedOrder(order);
                    setOpen(true);
                }}
                />


                <OrderDetails
                    open={open}
                    onOpenChange={setOpen}
                    order={selectedOrder}
                />

            </div>
        </AppLayout>
    );
}
