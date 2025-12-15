import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import orders from "@/routes/orders";
import { OrderItemTypes } from "@/types/order_items";
import { Link } from "@inertiajs/react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: OrderItemTypes | null;
};

export default function OrderDetails({ open, onOpenChange, order }: Props) {
    if (!order) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <div className="flex justify-between items-center">
                            <Button variant={'link'} className="p-0 text-blue-500">
                                <Link href={orders.show(order.id).url}>Order #{order.transaction.order_number}</Link>
                            </Button>
                            <div>
                                {order.status}
                            </div>
                        </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Details for this order item
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2 text-sm">
                    <div>
                        <span className="font-medium">Product:</span>{" "}
                        {order.product_name}
                    </div>
                    <div>
                        <span className="font-medium">Delivery Date:</span>{" "}
                        {order.delivery_date}
                    </div>
                    <div>
                        <span className="font-medium">Quantity:</span>{" "}
                        {order.quantity}
                    </div>
                    {/* <div>
                        <span className="font-medium">Price:</span>{" "}
                        {order.price}
                    </div> */}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
