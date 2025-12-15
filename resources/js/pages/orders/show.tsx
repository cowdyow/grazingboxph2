// resources/js/pages/ProductsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { ProductProps } from "@/types/product";
import { Head } from "@inertiajs/react";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderItemTypes } from "@/types/order_items";

type Props = {
    order: {
        data: OrderItemTypes;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const Show: React.FC<Props> = ({ order }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            Order Details for # {order.data.transaction.order_number}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    rawr
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default Show;
