import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import { EditIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import lalamove from "@/routes/lalamove";
import { LalamoveType } from "@/types/lalamove";
import { route } from "ziggy-js";

type Props = {
    rider: LalamoveType;
};
export default function EditLalamoveRider({ rider }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        order_item_id: rider.order_item_id,
        customer_name: rider.customer_name,
        rider_name: rider.rider_name,
        contact_no: rider.contact_no,
        status: rider.status,
        memo: rider.memo,
        booking_type: rider.booking_type,
        delivery_time: rider.delivery_time,
        product: rider.product,
        quantity: rider.quantity,
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('lalamove.update', rider.id), {
            onSuccess: () => setIsOpen(false),
        });

    };


    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button size={'icon'}>
                    <EditIcon />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Lalamove Rider</AlertDialogTitle>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Customer Name */}
                    <div>
                        <Label>Customer Name</Label>
                        <Input
                            value={data.customer_name}
                            onChange={(e) =>
                                setData("customer_name", e.target.value)
                            }
                        />
                        {errors.customer_name && (
                            <p className="text-sm text-red-500">
                                {errors.customer_name}
                            </p>
                        )}
                    </div>

                    {/* Rider Name */}
                    <div>
                        <Label>Rider Name</Label>
                        <Input
                            value={data.rider_name}
                            onChange={(e) =>
                                setData("rider_name", e.target.value)
                            }
                        />
                    </div>

                    {/* Contact Number */}
                    <div>
                        <Label>Contact Number</Label>
                        <Input
                            value={data.contact_no}
                            onChange={(e) =>
                                setData("contact_no", e.target.value)
                            }
                        />
                    </div>
                    {/* Booking Type */}
                    <div>
                        <Label>Booking Type</Label>
                        <Select
                            value={data.booking_type}
                            onValueChange={(value) =>
                                setData("booking_type", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select booking type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pickup">
                                    Pick Up
                                </SelectItem>
                                <SelectItem value="customer_booked">
                                    Customer Will Book
                                </SelectItem>
                                <SelectItem value="staff_booked">
                                    We Will Book
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.booking_type && (
                            <p className="text-sm text-red-500">
                                {errors.booking_type}
                            </p>
                        )}
                    </div>

                    {/* Delivery Time */}
                        <div>
                            <Label>Delivery Time</Label>
                            <Input
                                placeholder="e.g. 2PM, Anytime"
                                value={data.delivery_time}
                                onChange={(e) =>
                                    setData("delivery_time", e.target.value)
                                }
                            />

                            {errors.delivery_time && (
                                <p className="text-sm text-red-500">
                                    {errors.delivery_time}
                                </p>
                            )}
                        </div>

                  <div className="flex justify-between gap-2">

                    <div>
                        <Label>Quantity</Label>
                        <Input
                            value={data.quantity}
                            onChange={(e) =>
                                setData("quantity", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <Label>Product</Label>
                        <Input
                            value={data.product}
                            onChange={(e) =>
                                setData("product", e.target.value)
                            }
                        />
                    </div>

                    
</div>


                    {/* Status */}
                    <div>
                        <Label>Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) =>
                                setData("status", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="preparing">
                                    Preparing
                                </SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="picked_up">
                                    Picked Up
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Memo */}
                    <div>
                        <Label>Memo</Label>
                        <Input
                            value={data.memo}
                            onChange={(e) =>
                                setData("memo", e.target.value)
                            }
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Cancel
                        </AlertDialogCancel>
                        <Button disabled={processing}>
                            Save Rider
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
