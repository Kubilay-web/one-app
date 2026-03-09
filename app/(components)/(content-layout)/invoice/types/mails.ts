
// Enums based on schema
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  VIEWED = "VIEWED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export interface SendInvoiceResponse {
  success: boolean;
  error?: string;
  message?: string;
  messageId?: string;
}