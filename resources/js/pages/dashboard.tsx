import AddOrder from '@/components/dashboard/add-order';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { TransactionTypes } from '@/types/transactions';
import { OrderItemTypes } from '@/types/order_items';
import { useState } from 'react';
import OrderDetails from '@/components/dashboard/order-details';

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
};

    
export default function Dashboard({ orderItems }: Props) {
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
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                {/* <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div> */}
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                    eventClick={(info) => {
                        const orderId = Number(info.event.id);

                        const order = orderItems.data.find(
                            item => item.id === orderId
                        );

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
