import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { route } from 'ziggy-js';
import { OrderItemTypes } from "@/types/order_items";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { ProductProps } from "@/types/product";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    orderItem: OrderItemTypes;
}

export default function EditOrderItem({ orderItem }: Props) {
    const [products, setProducts] = useState<ProductProps[]>([]);

    const { data, setData, put, processing, errors } = useForm({
        product_id: orderItem.product_id,
        quantity: orderItem.quantity,
        delivery_date: orderItem.delivery_date,
        delivery_address: orderItem.delivery_address,
        booking_type: orderItem.booking_type,
        memo: orderItem.memo,
    });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        axios.get("/api/products").then((res) => setProducts(res.data));
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('orders.update', orderItem.id), {
            onSuccess: () => setIsOpen(false)
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button size="icon">
                    <EditIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Order</AlertDialogTitle>
                    <AlertDialogDescription>Update the order details below</AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label>Product</Label>
                        <Select
                            value={data.product_id?.toString() ?? ""}
                            onValueChange={(val) => setData('product_id', Number(val))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.product_id && <p className="text-red-500">{errors.product_id}</p>}
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <Input
                            type="number"
                            min={1}
                            value={data.quantity}
                            onChange={(e) => setData('quantity', Number(e.target.value))}
                        />
                        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                    </div>

                    <div>
                        <Label>Delivery Date</Label>
                        <Input
                            type="datetime-local"
                            step={3600}
                            value={data.delivery_date}
                            onChange={(e) => setData('delivery_date', e.target.value)}
                        />
                        {errors.delivery_date && <p className="text-red-500">{errors.delivery_date}</p>}
                    </div>

                    <div>
                        <Label>Delivery Address</Label>
                        <Input
                            value={data.delivery_address}
                            onChange={(e) => setData('delivery_address', e.target.value)}
                        />
                        {errors.delivery_address && <p className="text-red-500">{errors.delivery_address}</p>}
                    </div>

                    <div>
                        <Label>Booking Type</Label>
                        <Select
                            value={data.booking_type ?? ""}
                            onValueChange={(value) => setData("booking_type", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select booking type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pickup">Pick Up</SelectItem>
                                <SelectItem value="customer_booked">Customer Will Book</SelectItem>
                                <SelectItem value="staff_booked">We Will Book</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.booking_type && <p className="text-red-500">{errors.booking_type}</p>}
                    </div>


                    <div>
                        <Label>Memo</Label>
                        <Textarea
                            value={data.memo || ""}
                            onChange={(e) => setData('memo', e.target.value)}
                        />
                        {errors.memo && <p className="text-red-500">{errors.memo}</p>}
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save"}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
