import AddOrder from '@/components/dashboard/add-order';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { TransactionTypes } from '@/types/transactions';
import { OrderItemTypes } from '@/types/order_items';
import { useState } from 'react';
import OrderDetails from '@/components/dashboard/order-details';
import { route } from 'ziggy-js';
import { Card } from '@/components/ui/card';
import { MoveUpRightIcon } from 'lucide-react';
import lalamove from '@/routes/lalamove';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Product = {
    product_id: number;
    product_name: string;
    total_quantity: number; 
};

type Props = {
    orderItems: {
        data: OrderItemTypes[];
    };
    dashboardCount: {
        totalOrders: string;
        totalBoxes: string;
        products: Product[];
    };
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
                <div className='flex flex-col'>
                    <div className='text-xl'>
                        Hello Ate! Today is{" "}
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long", 
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                    <div className='text-sm text-gray-500'>
                        I love you keep on going! :) -coj
                    </div>
                </div>
                <AddOrder />
            </div>
            <div className='flex flex-row'>
                <div className="flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">

                       <div
                            className="p-6 rounded-xl bg-white dark:bg-[#222124] shadow border border-gray-200 dark:border-gray-900
                                        hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out"
                            >
                            <div className='flex justify-between items-center'>
                                <div className='inline-flex gap-1 items-center'>
                                    <h3 className="text-xl text-gray-700 dark:text-gray-200">
                                    Todays Order: 
                                    </h3>
                                    <div className='font-semibold text-xl p-3'>
                                    {dashboardCount.totalBoxes} Boxes
                                    </div>
                                </div>
                                <div
                                    className="border rounded-full p-2 dark:bg-white dark:text-black
                                                hover:bg-gray-200 dark:hover:bg-gray-300
                                                hover:scale-110 transition transform duration-200 ease-in-out"
                                    >
                                    <Link href={lalamove.index().url} className="flex items-center justify-center">
                                        <MoveUpRightIcon className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                                {dashboardCount.products.map((product) => (
                                <div
                                    key={product.product_id}
                                    className={`p-2 rounded-lg flex justify-between items-center border w-full
                                                ${product.total_quantity === 0
                                                ? "bg-green-100 dark:bg-green-800 border-green-400"
                                                : "bg-gray-50 dark:bg-[#222124] border-white-200 dark:border-white"}
                                                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
                                >
                                    <span className="text-gray-700 dark:text-gray-200">
                                    {product.product_name}
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-bold">
                                    {product.total_quantity}
                                    </span>
                                </div>
                                ))}
                            </div>
                            </div>

                            <div
                            className="p-6 rounded-xl bg-white dark:bg-[#222124] shadow flex flex-col justify-between border border-gray-200 dark:border-gray-900
                                        hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out"
                            >
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Sales
                            </h3>
                            <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                                $0
                            </div>
                            </div>

                    </div>
                    <Card className='p-4 dark:bg-[#1E1F23]'>
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
                        </Card>

                    <OrderDetails
                        open={open}
                        onOpenChange={setOpen}
                        order={selectedOrder}
                    />

                </div>
            </div>
        </AppLayout>
    );
}
