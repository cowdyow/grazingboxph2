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
import { OrderItemTypes } from "@/types/order_items";
import { OrderStatusBadge } from "../custom/order-status-badge";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderItemTypes | null;
};

export default function OrderDetails({ open, onOpenChange, order }: Props) {
  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Order #{order.id}</h2>
              <OrderStatusBadge status={order.status} />
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Detailed information for this order
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Customer Info */}
        <section className="mt-4 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-semibold mb-2">
                Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
                <div>
                <span className="font-medium">Name:</span> {order.transaction.customer.name}
                </div>
                <div>
                <span className="font-medium">Username:</span> {order.transaction.customer.username}
                </div>
                <div className="sm:col-span-2">
                <span className="font-medium">Address:</span> {order.transaction.customer.address}
                </div>
                <div>
                <span className="font-medium">Phone:</span> {order.transaction.customer.phone}
                </div>
            </div>
            </section>

            {/* Order Info */}
            <section className="mt-4 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-semibold  mb-2">
                Order Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
                <div>
                    <span className="font-medium">Quantity:</span> {order.quantity}
                </div>
                <div>
                    <span className="font-medium">Product:</span> {order.product_name}
                </div>
                <div>
                    <span className="font-medium">Delivery Date:</span> {order.delivery_date_display}
                </div>
                <div>
                    <span className="font-medium">Delivery Address:</span> {order.delivery_address}
                </div>
                
                <div>
                    <span className="font-medium">Booking Type:</span> {order.booking_type}
                </div>
            </div>
             <p className="mt-2">
                <span className="font-medium text-sm mt-2">Memo:</span> <blockquote className="mt-6 border-l-2 pl-6 italic">{order.memo}</blockquote>
            </p>
        </section>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
