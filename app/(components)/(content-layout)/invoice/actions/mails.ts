// "use server";

// // import InvoiceEmail, {
// //   InvoiceEmailDataProps,
// // } from "@/components/email-templates/invoice-email";

// import InvoiceEmail, { InvoiceEmailDataProps } from "../components/email-templates/invoice-email";


// import db from "@/app/lib/db";
// import { revalidatePath } from "next/cache";
// import { Resend } from "resend";
// import { validateRequest } from "@/app/auth";
// import { InvoiceStatus, SendInvoiceResponse } from "../types/mails";

// const resend = new Resend(process.env.RESEND_API_KEY);
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";


// // Helper function to get authenticated user
// async function getAuthenticatedUser() {
//   const { user } = await validateRequest();

//   if (!user?.email) {
//     throw new Error("Unauthorized");
//   }

//   const userData = await db.user.findUnique({
//     where: { email: user.email },
//     include: {
//       subscription: true,
//       brand: true,
//     },
//   });

//   if (!userData) {
//     throw new Error("User not found");
//   }

//   return userData;
// }

// // Validate email addresses
// function validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const valid: string[] = [];
//   const invalid: string[] = [];

//   emails.forEach((email) => {
//     if (emailRegex.test(email)) {
//       valid.push(email);
//     } else {
//       invalid.push(email);
//     }
//   });

//   return { valid, invalid };
// }

// // Send invoice email to customer
// export async function sendCustomerInvoice(
//   data: InvoiceEmailDataProps,
//   emails: string[],
//   invoiceId: string
// ): Promise<SendInvoiceResponse> {
//   try {
//     // Authenticate user
//     const user = await getAuthenticatedUser();
//     const userId = user.id;

//     // Validate emails
//     const { valid: validEmails, invalid: invalidEmails } = validateEmails(emails);

//     if (validEmails.length === 0) {
//       return {
//         success: false,
//         error: "No valid email addresses provided",
//       };
//     }

//     if (invalidEmails.length > 0) {
//       console.warn("Invalid emails skipped:", invalidEmails);
//     }

//     // Check if invoice exists and belongs to user
//     const invoice = await db.invoiceModel.findFirst({
//       where: {
//         id: invoiceId,
//         userId,
//       },
//       include: {
//         client: true,
//       },
//     });

//     if (!invoice) {
//       return {
//         success: false,
//         error: "Invoice not found",
//       };
//     }

//     // Generate invoice link
//     const invoiceLink = `${baseUrl}/invoices/${invoiceId}`;
//     data.invoiceUrl = invoiceLink;

//     // Get sender email from user's brand or use default
//     let fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
//     // If user has a brand with email, use that (but verify domain is verified in Resend)
//     if (user.brand?.email && user.brand.email.includes('@')) {
//       // In production, you'd want to check if this domain is verified in Resend
//       fromEmail = user.brand.email;
//     }

//     // Send the email
//     const { data: emailData, error } = await resend.emails.send({
//       from: fromEmail,
//       to: validEmails,
//       subject: `Invoice ${data.invoiceNumber} from ${data.companyName}`,
//       react: InvoiceEmail({ data }),
//       // Add tracking
//       tags: [
//         {
//           name: "invoiceId",
//           value: invoiceId,
//         },
//         {
//           name: "userId",
//           value: userId,
//         },
//       ],
//     });

//     if (error) {
//       console.error("Resend error:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to send email",
//       };
//     }

//     // Update the invoice status to SENT
//     await db.invoiceModel.update({
//       where: {
//         id: invoiceId,
//       },
//       data: {
//         status: InvoiceStatus.SENT,
//         sentAt: new Date(),
//       },
//     });

//     // Optionally, store email record in database
//     // You could create an EmailLog model for this

//     // Revalidate relevant paths
//     revalidatePath("/dashboard/invoices");
//     revalidatePath(`/dashboard/invoices/${invoiceId}`);
//     revalidatePath("/dashboard");

//     return {
//       success: true,
//       message: `Invoice sent successfully to ${validEmails.join(', ')}`,
//       messageId: emailData?.id,
//     };
//   } catch (error) {
//     console.error("Error sending invoice email:", error);
    
//     if (error instanceof Error && error.message === "Unauthorized") {
//       return {
//         success: false,
//         error: "Unauthorized",
//       };
//     }

//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to send invoice",
//     };
//   }
// }

// // Send invoice to multiple customers
// export async function sendBulkInvoices(
//   invoiceIds: string[],
//   emailMap: Map<string, string[]> // invoiceId -> emails
// ): Promise<{
//   success: boolean;
//   results: Array<{ invoiceId: string; success: boolean; error?: string }>;
// }> {
//   try {
//     const user = await getAuthenticatedUser();
//     const userId = user.id;

//     const results = [];

//     for (const invoiceId of invoiceIds) {
//       try {
//         // Get invoice data
//         const invoice = await db.invoiceModel.findFirst({
//           where: {
//             id: invoiceId,
//             userId,
//           },
//           include: {
//             client: true,
//             items: true,
//             user: {
//               include: {
//                 brand: true,
//               },
//             },
//           },
//         });

//         if (!invoice) {
//           results.push({
//             invoiceId,
//             success: false,
//             error: "Invoice not found",
//           });
//           continue;
//         }

//         // Prepare email data
//         const emailData: InvoiceEmailDataProps = {
//           companyName: invoice.user.brand?.name || "Your Company",
//           companyAddress: invoice.user.brand?.address || "",
//           companyPhone: invoice.user.brand?.phone || "",
//           companyEmail: invoice.user.brand?.email || "",
//           logoUrl: invoice.user.brand?.logo || "",
//           billToContactPerson: invoice.client.contactPerson,
//           billToCompanyName: invoice.client.companyName,
//           billToLocation: invoice.client.location || "",
//           billToPhone: invoice.client.phone || "",
//           invoiceNumber: invoice.invoiceNumber,
//           invoiceDate: invoice.invoiceDate.toISOString().split('T')[0],
//           invoiceDueDate: invoice.dueDate.toISOString().split('T')[0],
//           items: invoice.items.map(item => ({
//             description: item.description,
//             quantity: Number(item.quantity),
//             unitPrice: Number(item.unitPrice),
//             amount: Number(item.totalPrice),
//           })),
//           subtotal: Number(invoice.subtotal),
//           taxRate: invoice.user.brand?.taxRate || 0,
//           salesTax: Number(invoice.taxAmount),
//           total: Number(invoice.totalAmount),
//           paymentInfo: invoice.user.brand?.paymentInfo || "",
//           contactInfo: invoice.user.brand?.contactInfo || "",
//           thankYouMessage: invoice.user.brand?.thankYouMsg || "Thank you for your business!",
//           invoiceUrl: `${baseUrl}/invoices/${invoiceId}`,
//         };

//         const emails = emailMap.get(invoiceId) || [invoice.client.email].filter(Boolean);

//         if (emails.length === 0) {
//           results.push({
//             invoiceId,
//             success: false,
//             error: "No email addresses provided",
//           });
//           continue;
//         }

//         // Send email
//         const result = await sendCustomerInvoice(emailData, emails, invoiceId);
        
//         results.push({
//           invoiceId,
//           success: result.success,
//           error: result.error,
//         });

//         // Add delay to avoid rate limiting
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       } catch (error) {
//         results.push({
//           invoiceId,
//           success: false,
//           error: error instanceof Error ? error.message : "Unknown error",
//         });
//       }
//     }

//     return {
//       success: results.some(r => r.success),
//       results,
//     };
//   } catch (error) {
//     console.error("Error sending bulk invoices:", error);
//     return {
//       success: false,
//       results: [],
//     };
//   }
// }

// // Resend invoice
// export async function resendInvoice(invoiceId: string): Promise<SendInvoiceResponse> {
//   try {
//     const user = await getAuthenticatedUser();
//     const userId = user.id;

//     // Get invoice with all related data
//     const invoice = await db.invoiceModel.findFirst({
//       where: {
//         id: invoiceId,
//         userId,
//       },
//       include: {
//         client: true,
//         items: true,
//         user: {
//           include: {
//             brand: true,
//           },
//         },
//       },
//     });

//     if (!invoice) {
//       return {
//         success: false,
//         error: "Invoice not found",
//       };
//     }

//     // Prepare email data
//     const emailData: InvoiceEmailDataProps = {
//       companyName: invoice.user.brand?.name || "Your Company",
//       companyAddress: invoice.user.brand?.address || "",
//       companyPhone: invoice.user.brand?.phone || "",
//       companyEmail: invoice.user.brand?.email || "",
//       logoUrl: invoice.user.brand?.logo || "",
//       billToContactPerson: invoice.client.contactPerson,
//       billToCompanyName: invoice.client.companyName,
//       billToLocation: invoice.client.location || "",
//       billToPhone: invoice.client.phone || "",
//       invoiceNumber: invoice.invoiceNumber,
//       invoiceDate: invoice.invoiceDate.toISOString().split('T')[0],
//       invoiceDueDate: invoice.dueDate.toISOString().split('T')[0],
//       items: invoice.items.map(item => ({
//         description: item.description,
//         quantity: Number(item.quantity),
//         unitPrice: Number(item.unitPrice),
//         amount: Number(item.totalPrice),
//       })),
//       subtotal: Number(invoice.subtotal),
//       taxRate: invoice.user.brand?.taxRate || 0,
//       salesTax: Number(invoice.taxAmount),
//       total: Number(invoice.totalAmount),
//       paymentInfo: invoice.user.brand?.paymentInfo || "",
//       contactInfo: invoice.user.brand?.contactInfo || "",
//       thankYouMessage: invoice.user.brand?.thankYouMsg || "Thank you for your business!",
//       invoiceUrl: `${baseUrl}/invoices/${invoiceId}`,
//     };

//     const emails = [invoice.client.email].filter(Boolean) as string[];

//     if (emails.length === 0) {
//       return {
//         success: false,
//         error: "Client has no email address",
//       };
//     }

//     return sendCustomerInvoice(emailData, emails, invoiceId);
//   } catch (error) {
//     console.error("Error resending invoice:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to resend invoice",
//     };
//   }
// }

// // Get email sending status
// export async function getInvoiceEmailStatus(invoiceId: string): Promise<{
//   sent: boolean;
//   sentAt?: string;
//   status?: InvoiceStatus;
// }> {
//   try {
//     const user = await getAuthenticatedUser();
//     const userId = user.id;

//     const invoice = await db.invoiceModel.findFirst({
//       where: {
//         id: invoiceId,
//         userId,
//       },
//       select: {
//         status: true,
//         sentAt: true,
//       },
//     });

//     if (!invoice) {
//       return { sent: false };
//     }

//     return {
//       sent: invoice.status === InvoiceStatus.SENT,
//       sentAt: invoice.sentAt?.toISOString(),
//       status: invoice.status as InvoiceStatus,
//     };
//   } catch (error) {
//     console.error("Error checking email status:", error);
//     return { sent: false };
//   }
// }

// // Track email open (you'd need to implement this with Resend webhooks)
// export async function trackEmailOpen(invoiceId: string): Promise<void> {
//   try {
//     await db.invoiceModel.update({
//       where: { id: invoiceId },
//       data: {
//         viewedAt: new Date(),
//         status: InvoiceStatus.VIEWED,
//       },
//     });
    
//     revalidatePath(`/dashboard/invoices/${invoiceId}`);
//   } catch (error) {
//     console.error("Error tracking email open:", error);
//   }
// }

// // Test email configuration
// export async function testEmailConfiguration(): Promise<{
//   success: boolean;
//   message: string;
// }> {
//   try {
//     const user = await getAuthenticatedUser();

//     const testEmail = user.email;
//     if (!testEmail) {
//       return {
//         success: false,
//         message: "User has no email address",
//       };
//     }

//     const { data, error } = await resend.emails.send({
//       from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
//       to: [testEmail],
//       subject: "Test Email from Invoice Generator",
//       html: "<p>This is a test email to verify your email configuration is working correctly.</p>",
//     });

//     if (error) {
//       return {
//         success: false,
//         message: error.message,
//       };
//     }

//     return {
//       success: true,
//       message: "Test email sent successfully",
//     };
//   } catch (error) {
//     console.error("Error testing email configuration:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Failed to send test email",
//     };
//   }
// }


















"use server";

import InvoiceEmail, { InvoiceEmailDataProps } from "../components/email-templates/invoice-email";
import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { validateRequest } from "@/app/auth";
import { InvoiceStatus, SendInvoiceResponse } from "../types/mails";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const { user } = await validateRequest();
  if (!user?.email) throw new Error("Unauthorized");

  const userData = await db.user.findUnique({
    where: { email: user.email },
    include: { subscription: true, brand: true },
  });

  if (!userData) throw new Error("User not found");
  return userData;
}

// Validate email addresses
function validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];

  emails.forEach((email) => {
    if (emailRegex.test(email)) valid.push(email);
    else invalid.push(email);
  });

  return { valid, invalid };
}

// Send invoice email to customer
export async function sendCustomerInvoice(
  data: InvoiceEmailDataProps,
  emails: string[],
  invoiceId: string
): Promise<SendInvoiceResponse> {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    const { valid: validEmails, invalid: invalidEmails } = validateEmails(emails);
    if (validEmails.length === 0) return { success: false, error: "No valid email addresses provided" };
    if (invalidEmails.length > 0) console.warn("Invalid emails skipped:", invalidEmails);

    const invoice = await db.invoiceModel.findFirst({
      where: { id: invoiceId, userId },
      include: { client: true },
    });
    if (!invoice) return { success: false, error: "Invoice not found" };

    // Generate invoice link
    data.invoiceUrl = `${baseUrl}/invoices/${invoiceId}`;

    // Sender email (only verified domain)
    let fromEmail = process.env.RESEND_FROM_EMAIL || "Invenimus <noreply@mail.one-clone.com>";
    if (user.brand?.email?.endsWith("@mail.one-clone.com")) {
      fromEmail = user.brand.email;
    }

    // Send email
    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: validEmails,
      subject: `Invoice ${data.invoiceNumber} from ${data.companyName}`,
      react: InvoiceEmail({ data }),
      tags: [
        { name: "invoiceId", value: invoiceId },
        { name: "userId", value: userId },
      ],
    });

    if (error) return { success: false, error: error.message || "Failed to send email" };

    // Update invoice status
    await db.invoiceModel.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.SENT, sentAt: new Date() },
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Invoice sent successfully to ${validEmails.join(", ")}`,
      messageId: emailData?.id,
    };
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send invoice",
    };
  }
}

// Send invoice to multiple customers
export async function sendBulkInvoices(
  invoiceIds: string[],
  emailMap: Map<string, string[]> // invoiceId -> emails
): Promise<{ success: boolean; results: Array<{ invoiceId: string; success: boolean; error?: string }> }> {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;
    const results = [];

    for (const invoiceId of invoiceIds) {
      try {
        const invoice = await db.invoiceModel.findFirst({
          where: { id: invoiceId, userId },
          include: { client: true, items: true, user: { include: { brand: true } } },
        });

        if (!invoice) {
          results.push({ invoiceId, success: false, error: "Invoice not found" });
          continue;
        }

        const emailData: InvoiceEmailDataProps = {
          companyName: invoice.user.brand?.name || "Your Company",
          companyAddress: invoice.user.brand?.address || "",
          companyPhone: invoice.user.brand?.phone || "",
          companyEmail: invoice.user.brand?.email || "",
          logoUrl: invoice.user.brand?.logo || "",
          billToContactPerson: invoice.client.contactPerson,
          billToCompanyName: invoice.client.companyName,
          billToLocation: invoice.client.location || "",
          billToPhone: invoice.client.phone || "",
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate.toISOString().split("T")[0],
          invoiceDueDate: invoice.dueDate.toISOString().split("T")[0],
          items: invoice.items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            amount: Number(item.totalPrice),
          })),
          subtotal: Number(invoice.subtotal),
          taxRate: invoice.user.brand?.taxRate || 0,
          salesTax: Number(invoice.taxAmount),
          total: Number(invoice.totalAmount),
          paymentInfo: invoice.user.brand?.paymentInfo || "",
          contactInfo: invoice.user.brand?.contactInfo || "",
          thankYouMessage: invoice.user.brand?.thankYouMsg || "Thank you for your business!",
          invoiceUrl: `${baseUrl}/invoices/${invoiceId}`,
        };

        const emails = emailMap.get(invoiceId) || [invoice.client.email].filter(Boolean);
        if (emails.length === 0) {
          results.push({ invoiceId, success: false, error: "No email addresses provided" });
          continue;
        }

        const result = await sendCustomerInvoice(emailData, emails, invoiceId);
        results.push({ invoiceId, success: result.success, error: result.error });
        await new Promise((resolve) => setTimeout(resolve, 1000)); // rate limit delay
      } catch (error) {
        results.push({ invoiceId, success: false, error: error instanceof Error ? error.message : "Unknown error" });
      }
    }

    return { success: results.some((r) => r.success), results };
  } catch (error) {
    console.error("Error sending bulk invoices:", error);
    return { success: false, results: [] };
  }
}

// Resend invoice
export async function resendInvoice(invoiceId: string): Promise<SendInvoiceResponse> {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    const invoice = await db.invoiceModel.findFirst({
      where: { id: invoiceId, userId },
      include: { client: true, items: true, user: { include: { brand: true } } },
    });
    if (!invoice) return { success: false, error: "Invoice not found" };

    const emailData: InvoiceEmailDataProps = {
      companyName: invoice.user.brand?.name || "Your Company",
      companyAddress: invoice.user.brand?.address || "",
      companyPhone: invoice.user.brand?.phone || "",
      companyEmail: invoice.user.brand?.email || "",
      logoUrl: invoice.user.brand?.logo || "",
      billToContactPerson: invoice.client.contactPerson,
      billToCompanyName: invoice.client.companyName,
      billToLocation: invoice.client.location || "",
      billToPhone: invoice.client.phone || "",
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate.toISOString().split("T")[0],
      invoiceDueDate: invoice.dueDate.toISOString().split("T")[0],
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        amount: Number(item.totalPrice),
      })),
      subtotal: Number(invoice.subtotal),
      taxRate: invoice.user.brand?.taxRate || 0,
      salesTax: Number(invoice.taxAmount),
      total: Number(invoice.totalAmount),
      paymentInfo: invoice.user.brand?.paymentInfo || "",
      contactInfo: invoice.user.brand?.contactInfo || "",
      thankYouMessage: invoice.user.brand?.thankYouMsg || "Thank you for your business!",
      invoiceUrl: `${baseUrl}/invoices/${invoiceId}`,
    };

    const emails = [invoice.client.email].filter(Boolean);
    if (emails.length === 0) return { success: false, error: "Client has no email address" };

    return sendCustomerInvoice(emailData, emails, invoiceId);
  } catch (error) {
    console.error("Error resending invoice:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to resend invoice" };
  }
}

// Get email sending status
export async function getInvoiceEmailStatus(invoiceId: string): Promise<{
  sent: boolean;
  sentAt?: string;
  status?: InvoiceStatus;
}> {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    const invoice = await db.invoiceModel.findFirst({
      where: { id: invoiceId, userId },
      select: { status: true, sentAt: true },
    });

    if (!invoice) return { sent: false };
    return { sent: invoice.status === InvoiceStatus.SENT, sentAt: invoice.sentAt?.toISOString(), status: invoice.status as InvoiceStatus };
  } catch (error) {
    console.error("Error checking email status:", error);
    return { sent: false };
  }
}

// Track email open
export async function trackEmailOpen(invoiceId: string): Promise<void> {
  try {
    await db.invoiceModel.update({ where: { id: invoiceId }, data: { viewedAt: new Date(), status: InvoiceStatus.VIEWED } });
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
  } catch (error) {
    console.error("Error tracking email open:", error);
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getAuthenticatedUser();
    const testEmail = user.email;
    if (!testEmail) return { success: false, message: "User has no email address" };

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Invenimus <noreply@mail.one-clone.com>",
      to: [testEmail],
      subject: "Test Email from Invoice Generator",
      html: "<p>This is a test email to verify your email configuration is working correctly.</p>",
    });

    if (error) return { success: false, message: error.message };
    return { success: true, message: "Test email sent successfully" };
  } catch (error) {
    console.error("Error testing email configuration:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to send test email" };
  }
}