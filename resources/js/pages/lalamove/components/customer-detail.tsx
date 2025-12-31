import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CustomerType } from "@/types/customer";

type Props = {
  customer: CustomerType;
};

export default function CustomerDetail({ customer }: Props) {
    return (
        <AlertDialog>
        {/* Trigger: customer name */}
        <AlertDialogTrigger asChild>
            <Button variant="link" className="p-0 text-blue-500">
            {customer.username} / {customer.name}
            </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Customer Details</AlertDialogTitle>
            <AlertDialogDescription>
                Information for {customer.name}
            </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2 text-sm mt-2">
            <div>
                <span className="font-medium">Username:</span> {customer.username}
            </div>
            <div>
                <span className="font-medium">Address:</span> {customer.address}
            </div>
            <div>
                <span className="font-medium">Phone:</span> {customer.phone}
            </div>
            <div>
                <span className="font-medium">Source:</span> {customer.source}
            </div>
            </div>

            <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    );
}
