"use client";

// React, Next.js imports
import Image from "next/image";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

import { OrderStatus, PaymentStatus, StoreOrderType } from "@/app/lib/types";
import PaymentStatusTag from "@/app/projects/components/shared/payment-status";
import OrderStatusSelect from "@/app/projects/components/dashboard/forms/order-status-select";
import { Expand } from "lucide-react";
import { useModal } from "@/app/projects/components/providers/modal-provider";
import CustomModal from "@/app/projects/components/dashboard/shared/custom-modal";
import StoreOrderSummary from "@/app/projects/components/dashboard/shared/store-order-summary";

export const columns: ColumnDef<StoreOrderType>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => {
      return <span>{row.original.id}</span>;
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const images = row.original.items.map((product) => product.image);
      return (
        <div className="flex flex-wrap gap-1">
          {images.map((img, i) => (
            <Image
              key={`${img}-${i}`}
              src={img}
              alt=""
              width={100}
              height={100}
              className="h-7 w-7 rounded-full object-cover"
              style={{ transform: `translateX(-${i * 15}px)` }}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      return (
        <div>
          <PaymentStatusTag
            status={row.original.order.paymentStatus as PaymentStatus}
            isTable
          />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div>
          <OrderStatusSelect
            groupId={row.original.id}
            status={row.original.status as OrderStatus}
            storeId={row.original.storeId}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      return <span>${row.original.total.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "open",
    header: "",
    cell: ({ row }) => {
      return <ViewOrderButton group={row.original} />;
    },
  },
];

interface ViewOrderButtonProps {
  group: StoreOrderType;
}

const ViewOrderButton: React.FC<ViewOrderButtonProps> = ({ group }) => {
  const { setOpen } = useModal();

  return (
    <button
      className="group relative isolation-auto z-10 mx-auto flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 bg-[#0A0D2D] px-4 py-2 font-sans text-lg text-gray-50 backdrop-blur-md before:absolute before:-left-full before:-z-10 before:aspect-square before:w-full before:rounded-full before:bg-blue-primary before:transition-all before:duration-700 hover:text-gray-50 before:hover:left-0 before:hover:w-full before:hover:scale-150 before:hover:duration-700 lg:font-semibold"
      onClick={() => {
        setOpen(
          <CustomModal maxWidth="!max-w-3xl">
            <StoreOrderSummary group={group} />
          </CustomModal>,
        );
      }}
    >
      View
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
        <Expand className="w-5 stroke-black" />
      </span>
    </button>
  );
};
