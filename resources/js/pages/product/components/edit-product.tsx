import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import products from "@/routes/products";
import { ProductProps } from "@/types/product";
import { useForm } from "@inertiajs/react";
import { EditIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { route } from 'ziggy-js';

interface EditProductProps {
    product: ProductProps;
}

export default function EditProduct({ product }: EditProductProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        description: product.description,
        price: product.price,
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('products.update', product.id));
        setIsOpen(false);
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
                    <AlertDialogTitle>Edit Product</AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label>Product Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Product Description</Label>
                        <Input
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Price</Label>
                        <Input
                            value={data.price}
                            min={0}
                            onChange={(e) => setData('price', Number(e.target.value))}
                        />

                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                        <Button disabled={processing}>Save</Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

