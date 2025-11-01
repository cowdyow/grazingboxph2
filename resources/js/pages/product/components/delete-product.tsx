import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { route } from "ziggy-js";
import { ProductProps } from "@/types/product";

interface DeleteProductProps {
    product: ProductProps;
}

export default function DeleteProduct({ product }: DeleteProductProps) {
    const { delete: destroy, processing } = useForm();
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleDelete = () => {
        destroy(route("products.destroy", product.id), {
            onSuccess: () => setIsOpenDialog(false),
        });
    };

    return (
        <AlertDialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" >
                    <Trash2Icon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full max-w-xs p-4 mx-auto rounded-lg sm:max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Delete {product.name}? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={processing}>
                        {processing ? "Deleting..." : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
