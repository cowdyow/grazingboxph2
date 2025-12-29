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
import { Checkbox } from "../ui/checkbox";

interface OrderItem {
    product_id: number | null;
    quantity: number;
    delivery_date: string;
    booking_type: "pickup" | "customer_booked" | "staff_booked" | "";
    delivery_address: string;
    memo?: string;
}

interface OrderFormData {
    name: string;
    username: string;
    address: string;
    phone: string;
    source?: string;
    items: OrderItem[];
}


export default function AddOrder() {
    const { data, setData, post, processing, errors, reset } = useForm<OrderFormData>({
        name: "",
        username: "",
        address: "",
        phone: "",
        source: "",
        items: [
            {
            product_id: null,
            quantity: 1,
            delivery_date: "",
            booking_type: "",
            delivery_address: "",
            memo: "",
            },
        ],
    });

    const [products, setProducts] = useState<ProductProps[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<Customer[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [copyAddress, setCopyAddress] = useState<boolean[]>([]);

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

    const handleSelect = (username: string) => {
        const customer = customers.find((c) => c.username === username);
        if (customer) {
        setData({
            ...data,
            username: customer.username,
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            source: customer.source
        });
        }
    };;

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            post(route("transaction.orders.store"), {
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

        <AlertDialogContent className="sm:max-w-[60vw] max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
            <AlertDialogTitle>Add New Order</AlertDialogTitle>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* CUSTOMER DETAILS */}
            <div className="grid sm:grid-cols-2 gap-4">
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
                    {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id}</p>}
                </div>

                <div>
                    <Label>Name</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Enter customer name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
                    <Label>Address</Label>
                    <Input
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        placeholder="Enter address"
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                <div>
                    <Label>Phone</Label>
                    <Input
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        placeholder="Enter phone"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div>
                    <Label>Source</Label>
                    <Input
                        value={data.source}
                        onChange={(e) => setData("source", e.target.value)}
                        placeholder="Select Source"
                    />
                    {errors.source && <p className="text-red-500 text-sm">{errors.source}</p>}
                </div>
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Order Items</h3>
                    <Button type="button" variant="secondary" onClick={addItem}>
                        <PlusIcon className="mr-2" /> Add Item
                    </Button>
                </div>

                {data.items.map((item, index) => (
                    <div key={index} className="border rounded p-4 mt-4 space-y-3 relative">
                        {/* Grid: 1 column on mobile, 2 columns on sm+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Product */}
                            <div>
                                <Label>Product</Label>
                                <Select
                                value={item.product_id?.toString() ?? ""}
                                onValueChange={(val) => updateItem(index, "product_id", Number(val))}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                        {product.name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                {errors[`items.${index}.product_id`] && (
                                <p className="text-red-500 text-sm">{errors[`items.${index}.product_id`]}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <Label>Quantity</Label>
                                <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                                />
                                {errors[`items.${index}.quantity`] && (
                                <p className="text-red-500 text-sm">{errors[`items.${index}.quantity`]}</p>
                                )}
                            </div>
                        </div>

                        {/* Delivery Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="mt-4">
                            <Label>Delivery Date</Label>
                            <Input
                                type="datetime-local"
                                step={3600}
                                value={item.delivery_date}
                                onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                    const [date, time] = value.split("T");
                                    const hour = time.split(":")[0];
                                    updateItem(index, "delivery_date", `${date}T${hour}:00`);
                                }
                                }}
                            />
                            {errors[`items.${index}.delivery_date`] && (
                                <p className="text-red-500 text-sm">{errors[`items.${index}.delivery_date`]}</p>
                            )}
                            </div>

                            {/* Delivery Address */}
                            <div className="mt-4">
                                <Label>Delivery Address</Label>
                                <Input
                                    value={item.delivery_address}
                                    onChange={(e) => updateItem(index, "delivery_address", e.target.value)}
                                    placeholder="Enter delivery address"
                                    disabled={copyAddress[index] === true}
                                />
                                {errors[`items.${index}.delivery_address`] && (
                                    <p className="text-red-500 text-sm">{errors[`items.${index}.delivery_address`]}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <Checkbox
                                    checked={copyAddress[index] === true}
                                    onCheckedChange={(checked) => {
                                        const temp = [...copyAddress];
                                        temp[index] = checked === true;
                                        setCopyAddress(temp);

                                        if (checked) {
                                        updateItem(index, "delivery_address", data.address);
                                        } else {
                                        updateItem(index, "delivery_address", "");
                                        }
                                    }}
                                    />
                                    <Label className="text-sm">Same as customer address</Label>
                                </div>
                            </div>
                        </div>
                        {/* Booking Type */}
                        <div className="mt-4">
                        <Label>Booking Type</Label>
                        <Select
                            value={item.booking_type ?? ""}
                            onValueChange={(value) => updateItem(index, "booking_type", value)}
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="Select booking type" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="pickup">Pick Up</SelectItem>
                            <SelectItem value="customer_booked">Customer Will Book</SelectItem>
                            <SelectItem value="staff_booked">We Will Book</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors[`items.${index}.booking_type`] && (
                            <p className="text-red-500 text-sm">{errors[`items.${index}.booking_type`]}</p>
                        )}
                        </div>

                        {/* Memo */}
                        <div className="mt-4">
                        <Label>Memo</Label>
                        <Input
                            value={item.memo || ""}
                            onChange={(e) => updateItem(index, "memo", e.target.value)}
                            placeholder="Optional memo"
                        />
                        </div>

                        {/* Remove Button */}
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
