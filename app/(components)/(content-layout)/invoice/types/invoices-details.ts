interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logoUrl: string;
  contactInfo: string;
  paymentInfo: string;
  thankYouMessage: string;
  brandColor: string;

  billToContactPerson: string;
  billToCompanyName: string;
  billToLocation: string;
  billToPhone: string;

  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  customerID: string;
  preparedBy: string;

  items: Array<{
    quantity: number;
    description: string;
    unitPrice: number;
    amount: number;
  }>;

  subtotal: number;
  taxRate: number;
  salesTax: number;
  other: number;
  total: number;
}