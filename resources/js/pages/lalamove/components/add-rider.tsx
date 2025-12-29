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
import { BikeIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import lalamove from "@/routes/lalamove";

export default function AddLalamoveRider({ orderId }) {
    const { data, setData, post, processing, errors } = useForm({
        order_item_id: orderId,
        rider_name: "",
        contact_no: "",
        memo: "",
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(lalamove.store().url, {
            onSuccess: () => setIsOpen(false),
        });
    };


    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button size="sm">
                    <BikeIcon className="mr-1 h-4 w-4" />
                    Add Rider
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
                        <Label>Lalamove Link / Memo</Label>
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
