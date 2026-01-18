// resources/js/pages/TransactionsPage.tsx
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

type SalesProps = {
  salesData: Record<string, number[]>; 
  amountData: number[];                
  daysInMonth: number;
};

const SalesPage: React.FC<SalesProps & { selectedMonth: number; selectedYear: number }> = ({
  salesData,
  amountData,
  daysInMonth,
  selectedMonth,
  selectedYear,
}) => {

    const [date, setDate] = useState(new Date(selectedYear, selectedMonth - 1));

    const handleChange = (selectedDate: Date) => {
        setDate(selectedDate);

        // Send request to backend
        router.get(
        '/sales',
        { month: selectedDate.getMonth() + 1, year: selectedDate.getFullYear() },
        { preserveState: true }
        );
    };
    return (
        <AppLayout>
        <Head title="Sales" />
        <div className="py-4 space-y-4">
            <div className="flex items-center gap-2">
                <input
                type="month"
                className="border rounded px-2 py-1"
                value={`${selectedYear}-${String(selectedMonth).padStart(2, "0")}`} // YYYY-MM
                onChange={(e) => {
                    const [year, month] = e.target.value.split("-");
                    router.get(
                    "/sales",
                    { year: Number(year), month: Number(month) },
                    { preserveState: true }
                    );
                }}
                />
            </div>
            <Card className="dark:bg-[#222124]">
                <CardHeader>
                    <CardTitle>Total Orders</CardTitle>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="sticky left-0 bg-white dark:bg-[#222124] z-10">Product</TableHead>
                            {Array.from({ length: daysInMonth }, (_, i) => (
                                <TableHead key={i} className="text-center">{i + 1}</TableHead>
                            ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {Object.entries(salesData).map(([productName, days]) => (
                            <TableRow key={productName}>
                                <TableCell className="sticky left-0 bg-white dark:bg-[#222124] z-10">{productName}</TableCell>
                                {Object.values(days).map((qty, index) => (
                                <TableCell key={index} className="text-center">
                                    {qty === 0 ? "-" : qty}
                                </TableCell>
                                ))}
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="dark:bg-[#222124]">
                <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Date</TableHead>
                            {Array.from({ length: daysInMonth }, (_, i) => (
                                <TableHead key={i} className="text-center">{i + 1}</TableHead>
                            ))}
                            <TableHead className="text-center">Total</TableHead> {/* Added total header */}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                            <TableCell>PHP</TableCell>
                            {Object.values(amountData).map((amt, index) => (
                                <TableCell key={index} className="text-center">
                                {amt === 0 ? "-" : amt.toFixed(2)}
                                </TableCell>
                            ))}
                            <TableCell className="text-center">
                                {Object.values(amountData).reduce((sum, amt) => sum + amt, 0).toFixed(2)}
                            </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        </AppLayout>
    );
};

export default SalesPage;
