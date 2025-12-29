import React from "react";
import { Badge } from "@/components/ui/badge";

type BookingType = "pickup" | "customer_booked" | "staff_booked";

interface BookingTypeBadgeProps {
  type: BookingType;
}

const bookingTypeMap: Record<
  BookingType,
  { label: string; className: string }
> = {
  pickup: {
    label: "Pick Up",
    className: "bg-yellow-100 text-yellow-800",
  },
  customer_booked: {
    label: "Customer Will Book",
    className: "bg-blue-100 text-blue-800",
  },
  staff_booked: {
    label: "I Will Book",
    className: "bg-green-100 text-green-800",
  },
};

export const BookingTypeBadge: React.FC<BookingTypeBadgeProps> = ({ type }) => {
  const booking = bookingTypeMap[type];

  if (!booking) return null;

  return (
    <Badge className={booking.className}>
      {booking.label}
    </Badge>
  );
};
