import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
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

type Props = {
    riders: LalamoveType[];
    filters: {
        search?: string;
    };
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
    preparing: {
        label: "Preparing",
        className: "bg-yellow-100 text-yellow-800",
    },
    ready: {
        label: "Ready",
        className: "bg-blue-100 text-blue-800",
    },
    picked_up: {
        label: "Picked Up",
        className: "bg-green-100 text-green-800",
    },
};

const LalamovePage: React.FC<Props> = ({ riders, filters }) => {
    const [search, setSearch] = useState(filters.search || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.get(
            route("lalamove.index"),
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleReset = () => {
        router.get(route("lalamove.index"));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lalamove Riders" />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center gap-2">
                        <CardTitle>Lalamove Rider</CardTitle>

                        {/* SEARCH */}
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                placeholder="Search customer or rider..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64"
                            />
                            <Button type="submit">Search</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </form>

                        <AddLalamoveRider />
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Rider Name</TableHead>
                                <TableHead>Rider Contact No</TableHead>
                                <TableHead>Lalamove Link</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Picked Up Date</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {riders.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.customer_name}</TableCell>
                                    <TableCell>{item.rider_name}</TableCell>
                                    <TableCell>{item.contact_no}</TableCell>
                                    <TableCell>
                                        {item.memo && (
                                            <a
                                                href={item.memo}
                                                className="text-blue-600 underline"
                                                target="_blank"
                                            >
                                                Link
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(() => {
                                            const status = statusMap[item.status];

                                            return status ? (
                                                <Badge className={status.className}>
                                                    {status.label}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    {item.status}
                                                </Badge>
                                            );
                                        })()}
                                    </TableCell>

                                    <TableCell>{item.picked_up_at}</TableCell>
                                    <TableCell>
                                        <EditLalamoveRider rider={item} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default LalamovePage;
