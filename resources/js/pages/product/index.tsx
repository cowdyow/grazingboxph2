// resources/js/pages/ProductsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { ProductProps } from "@/types/product";
import { Head } from "@inertiajs/react";
import React from "react";
import AddProduct from "./components/add-product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EditProduct from "./components/edit-product";
import DeleteProduct from "./components/delete-product";

type Props = {
    products: {
        data: ProductProps[];
        meta?: any;
        links?: any;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const ProductsPage: React.FC<Props> = ({ products }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <Card className="dark:bg-[#1E1F23]">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            Products
                        </CardTitle>
                        <AddProduct />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((item: ProductProps, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>
                                        <div className="inline-flex gap-2">
                                            <EditProduct product={item} />
                                            <DeleteProduct product={item} />
                                        </div>
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

export default ProductsPage;
