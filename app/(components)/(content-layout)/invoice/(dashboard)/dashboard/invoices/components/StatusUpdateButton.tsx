"use client";
import { useState } from "react";
import {
  ChevronDown,
  X,
  Check,
  Clock,
  Send,
  Eye,
  Ban,
  FileText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { Button } from "../../../../components/ui/button";
import { updateInvoiceStatus } from "../../../../actions/invoices";
import { toast } from "sonner";

type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

interface InvoiceStatusPopupProps {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}

const statusConfig = {
  DRAFT: {
    label: "Draft",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: FileText,
    description: "Invoice is being prepared",
  },
  SENT: {
    label: "Sent",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: Send,
    description: "Invoice has been sent to client",
  },
  VIEWED: {
    label: "Viewed",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    icon: Eye,
    description: "Client has viewed the invoice",
  },
  PAID: {
    label: "Paid",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: Check,
    description: "Payment has been received",
  },
  OVERDUE: {
    label: "Overdue",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: Clock,
    description: "Payment is past due date",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-500",
    bgColor: "bg-gray-200",
    icon: Ban,
    description: "Invoice has been cancelled",
  },
} as const;

export default function InvoiceStatusPopup({
  invoiceId,
  currentStatus,
}: InvoiceStatusPopupProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<InvoiceStatus>(currentStatus);

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await updateInvoiceStatus(invoiceId, selectedStatus);
      setOpen(false);
      toast.success("Invoice updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) setSelectedStatus(currentStatus);
  };

  const currentConfig = statusConfig[currentStatus];
  const CurrentIcon = currentConfig.icon;
  const selectedConfig = statusConfig[selectedStatus];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`rounded-full px-3 py-1 text-sm ${currentConfig.bgColor} ${currentConfig.color}`}
        >
          <CurrentIcon className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black border border-gray-200">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded ${currentConfig.bgColor}`}>
              <CurrentIcon className={currentConfig.color} />
            </div>
            <div>
              <DialogTitle className="text-black">
                Update Invoice Status
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {invoiceId}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Current */}
          <div className="p-4 border rounded bg-white">
            <p className="text-sm text-gray-600 mb-2">Current Status</p>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full ${currentConfig.bgColor} ${currentConfig.color}`}
            >
              <CurrentIcon className="h-4 w-4 mr-2" />
              {currentConfig.label}
            </div>
          </div>

          {/* Select */}
          <Select
            value={selectedStatus}
            onValueChange={(v: InvoiceStatus) => setSelectedStatus(v)}
          >
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="bg-white text-black">
              {(Object.keys(statusConfig) as InvoiceStatus[]).map((status) => {
                const cfg = statusConfig[status];
                const Icon = cfg.icon;

                return (
                  <SelectItem
                    key={status}
                    value={status}
                    disabled={status === currentStatus}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cfg.color} />
                      {cfg.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Preview */}
          {selectedStatus !== currentStatus && (
            <div className="p-3 border rounded bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">New Status</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded ${selectedConfig.bgColor} ${selectedConfig.color}`}
              >
                {selectedConfig.label}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating}
            className="bg-black text-white hover:bg-gray-800"
          >
            {isUpdating ? "Updating..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}