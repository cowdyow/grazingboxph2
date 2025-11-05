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
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { route } from "ziggy-js";
import { ProductProps } from "@/types/product";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem } from "../ui/combobox";

interface OrderItem {
    product_id: number | null;
    quantity: number;
    delivery_date: string;
    delivery_address: string;
    memo?: string;
}
interface OrderItem {
    product_id: number | null;
    quantity: number;
    delivery_date: string;
    address: string;
    memo?: string;
}

interface FormData {
    name: string;
    username: string;
    address: string;
    phone: string;
    source?: string;
    items: OrderItem[];
}


export default function AddOrder() {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: "",
        username: "",
        address: "",
        phone: "",
        source: "",
        items: [
        { product_id: null, quantity: 1, delivery_date: "", delivery_address: "", memo: "" },
        ],
    });

    const [products, setProducts] = useState<ProductProps[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<Customer[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load products and customers
    useEffect(() => {
        axios.get("/api/products").then((res) => setProducts(res.data));
        axios.get("/api/customers").then((res) => setCustomers(res.data));
    }, []);

    const handleSearch = (value: string) => {
        setData("username", value);
        if (value.trim() === "") {
        setFiltered([]);
        return;
        }
        const results = customers.filter((c) =>
        c.username.toLowerCase().includes(value.toLowerCase())
        );
        setFiltered(results);
    };

    // When a username is selected from combobox
    const handleSelect = (username: string) => {
        const customer = customers.find((c) => c.username === username);
        if (customer) {
        setData({
            ...data,
            username: customer.username,
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
        });
        }
    };;

    // Manage dynamic order items
    const addItem = () => {
        setData("items", [
        ...data.items,
        { product_id: null, quantity: 1, delivery_date: "", delivery_address: "", memo: "" },
        ]);
    };

    const updateItem = (index: number, key: keyof OrderItem, value: any) => {
        const newItems = [...data.items];
        newItems[index][key] = value;
        setData("items", newItems);
    };

    const removeItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData("items", newItems);
    };

    // Submit form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
         setIsOpen(false);
        post(route("orders.store"), {
        onSuccess: () => {
            setIsOpen(false);
            reset();
        },
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
            <Button>
            <PlusIcon className="mr-2" /> Add Order
            </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
            <AlertDialogTitle>Add New Order</AlertDialogTitle>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* CUSTOMER DETAILS */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                 <Label>Customer Username</Label>
      <Combobox type="single" onValueChange={handleSelect}>
        <ComboboxInput
          placeholder="Search username..."
          value={data.username}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <ComboboxContent>
          {filtered.length === 0 ? (
            <ComboboxEmpty>No customers found.</ComboboxEmpty>
          ) : (
            <ComboboxGroup heading="Customers">
              {filtered.map((c) => (
                <ComboboxItem key={c.id} value={c.username}>
                  {c.username}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxContent>
      </Combobox>
                {errors.username && <p className="text-red-500">{errors.username}</p>}
                </div>

                <div>
                <Label>Name</Label>
                <Input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Enter customer name"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                <div>
                <Label>Address</Label>
                <Input
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500">{errors.address}</p>}
                </div>

                <div>
                <Label>Phone</Label>
                <Input
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="Enter phone"
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Order Items</h3>
                <Button type="button" variant="secondary" onClick={addItem}>
                    <PlusIcon className="mr-2" /> Add Item
                </Button>
                </div>

                {data.items.map((item, index) => (
                <div key={index} className="border rounded p-4 mt-4 space-y-3 relative">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                        <Label>Product</Label>
                        <Select
                        value={item.product_id?.toString() ?? ""}
                        onValueChange={(val) =>
                            updateItem(index, "product_id", Number(val))
                        }
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                            <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                            >
                                {product.name} - ₱{product.price}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                            updateItem(index, "quantity", Number(e.target.value))
                        }
                        />
                    </div>

                    <div>
                        <Label>Delivery Date</Label>
                        <Input
                        type="date"
                        value={item.delivery_date}
                        onChange={(e) =>
                            updateItem(index, "delivery_date", e.target.value)
                        }
                        />
                    </div>

                    <div className="col-span-2 md:col-span-3">
                        <Label>Delivery Address</Label>
                        <Input
                        value={item.delivery_address}
                        onChange={(e) =>
                            updateItem(index, "delivery_address", e.target.value)
                        }
                        placeholder="Enter delivery address"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-3">
                        <Label>Memo</Label>
                        <Input
                        value={item.memo || ""}
                        onChange={(e) => updateItem(index, "memo", e.target.value)}
                        placeholder="Optional memo"
                        />
                    </div>
                    </div>

                    <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 mb-2"
                    onClick={() => removeItem(index)}
                    >
                    <Trash2Icon className="h-4 w-4" />
                    </Button>
                </div>
                ))}
            </div>

            {/* FOOTER BUTTONS */}
            <AlertDialogFooter className="mt-4">
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
