import { 
  AlertDialog, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { route } from "ziggy-js";
import { ProductProps } from "@/types/product";

interface FormData {
  name: string;
  username: string;
  address: string;
  phone: string;
  product_id: number | null;
}

export default function AddOrder() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: "",
        username: "",
        address: "",
        phone: "",
        product_id: null,
    });

    const [products, setProducts] = useState<ProductProps[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        axios.get("/api/products")
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error loading products:", err));
    }, []);

    // Sync selected product with Inertia form
    useEffect(() => {
        setData("product_id", selectedProduct);
    }, [selectedProduct]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("orders.store")); // Make sure your backend route exists
        setIsOpen(false);
    };

    console.log(data)

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
            <Button>
            <PlusIcon /> Add Order
            </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Add New Order</AlertDialogTitle>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <Label>Customer Name</Label>
                <Input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Enter customer name"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div>
                <Label>Customer Username</Label>
                <Input
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                placeholder="Enter username"
                />
                {errors.username && <p className="text-red-500">{errors.username}</p>}
            </div>

            <div>
                <Label>Customer Address</Label>
                <Input
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500">{errors.address}</p>}
            </div>

            <div>
                <Label>Customer Phone</Label>
                <Input
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>

            <div>
                <Label>Product</Label>
                <Select
                value={selectedProduct ?? undefined}
                onValueChange={(val) => setSelectedProduct(Number(val))}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                    {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - ${product.price}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                {errors.product_id && <p className="text-red-500">{errors.product_id}</p>}
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
