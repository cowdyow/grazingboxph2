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
import { BikeIcon, EditIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import lalamove from "@/routes/lalamove";
import { LalamoveType } from "@/types/lalamove";
import { route } from "ziggy-js";
import { OrderItemTypes } from "@/types/order_items";

type Props = {
    order: OrderItemTypes;
};
export default function EditLalamoveRider({ order }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        order_item_id: order.id,
        rider_name: order.lalamove?.rider_name ?? "",
        contact_no: order.lalamove?.contact_no ?? "",
        memo: order.lalamove?.memo ?? "",
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('lalamove.update', order.id), {
            onSuccess: () => setIsOpen(false),
        });

    };


    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button size={'icon'}>
                    <BikeIcon />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Lalamove Rider</AlertDialogTitle>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
