import React from "react";
import { cn } from "@/lib/utils"; // optional helper for conditional classnames

type OrderStatus = "pending" | "in-progress" | "ready" | "completed";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusColors: Record<OrderStatus, string> = {
  "pending": "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "ready": "bg-indigo-100 text-indigo-800",
  "completed": "bg-green-100 text-green-800",
};

// Helper to convert 'in-progress' → 'InProgress'
const toCamelCase = (str: string) =>
  str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-semibold",
        statusColors[status]
      )}
    >
      {toCamelCase(status)}
    </span>
  );
};
