import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import products from "@/routes/products";
import { useForm } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { route } from 'ziggy-js';


export default function AddProduct() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
    });
    
    const [ isOpen, setIsOpen ] = useState();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('products.store'));
        setIsOpen(false);
        reset();
    }


    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button>
                    <PlusIcon /> Product
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Rank Type</AlertDialogTitle>
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
                                onChange={(e) => setData('price', e.target.value)}
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
