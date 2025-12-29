// resources/js/pages/TransactionsPage.tsx
import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { route } from "ziggy-js";
import { TransactionTypes } from "@/types/transactions";
import transactionsRoute from "@/routes/transactions";



type Props = {
  transactions: {
    data: TransactionTypes[];
  };
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: dashboard().url },
];

const TransactionsPage: React.FC<Props> = ({ transactions }) => {
const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
const [search, setSearch] = useState("");

const handleFilter = (value: string) => {
    setMonth(value);
    router.get(
    route("transactions.index"),
    { month: value, search },
    { preserveState: true, replace: true }
    );
};

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    router.get(
    route("transactions.index"),
    { month, search: value },
    { preserveState: true, replace: true }
    );
};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="py-4 space-y-4">
                <Card>
                    <CardHeader className="flex justify-between ">
                        <CardTitle>
                        Transactions for {new Date(month + "-01").toLocaleString('en-US', {
                            month: 'long',
                            year: 'numeric'
                        })}
                        </CardTitle>
                        <div className="flex gap-2 items-center">
                        <Input
                            type="month"
                            value={month}
                            onChange={(e) => handleFilter(e.target.value)}
                            className="w-auto"
                        />
                    
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.data.length > 0 ? (
                            transactions.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Link href={transactionsRoute.show(item.id).url}>
                                            <div className="text-blue-500">{item.order_number}</div>
                                        </Link></TableCell>
                                    <TableCell>{item.customer.name} / {item.customer.username} </TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.created_at}</TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                No transactions found.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default TransactionsPage;
