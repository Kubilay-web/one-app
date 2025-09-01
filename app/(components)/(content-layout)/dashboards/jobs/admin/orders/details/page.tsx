"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { downloadBlobAsFile } from "@/app/lib/utils";
import { OrderFullJobType } from "@/app/lib/types";
import { generateOrderPDFBlob } from "./invoice";
import { Button } from "@/app/projects/components/ui/button";
import { Download } from "lucide-react";

export default function CheckoutPage({ searchParams }: { searchParams: any }) {
  const [details, setDetails] = useState<any[]>([]);
  const [companydata, setCompanyData] = useState<any>(null);
  const [order, setOrder] = useState<OrderFullJobType | null>(null);
  const [plandata, setPlansData] = useState<any>(null);

  const id = searchParams?.id;

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/orders/details/${id}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        setDetails(data);
        setOrder(data[0]);
        setCompanyData(data[0].company);
        setPlansData(data[0].plan);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    if (!order) return toast.error("Sipariş bilgisi yüklenmedi");
    try {
      const pdfBlob = await generateOrderPDFBlob(order);
      downloadBlobAsFile(pdfBlob, `Order_${order.order_id}.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("PDF indirilirken bir hata oluştu");
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="relative w-full h-72 bg-cover bg-center" style={{ backgroundImage: 'url("/assets/images/jobportal/dee.jpg")' }}>
        <div className="absolute top-5 left-5 text-white">
          <h6 className="text-sm">Home &gt; dashboard &gt; admin &gt; orders &gt; details</h6>
        </div>
      </div>

      {/* Download Button */}
      <div className="w-11/12 mx-auto text-center my-6">
        <Button variant="outline" className="mb-4 flex items-center justify-center gap-2" onClick={handleDownload}>
          <Download className="w-4 h-4" />
          Download Invoice
        </Button>
      </div>

      {/* Payment Details */}
      <main className="w-11/12 mx-auto mb-10">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-center text-2xl font-semibold mb-6">Payment Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Order ID", "Package Name", "Amount", "Default Amount", "Currency", "Payment Status", "Date"].map((title) => (
                    <th key={title} className="px-4 py-2 text-left font-medium text-gray-700">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {details.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{order.order_id}</td>
                    <td className="px-4 py-2">{order.package_name}</td>
                    <td className="px-4 py-2">{order.amount}</td>
                    <td className="px-4 py-2">{order.default_amount}</td>
                    <td className="px-4 py-2">{order.paid_in_currency}</td>
                    <td className="px-4 py-2">{order.payment_status}</td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Company Details */}
      <main className="w-11/12 mx-auto mb-10">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-center text-2xl font-semibold mb-6">Company Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Name", "Email", "Phone", "Address", "Bio"].map((title) => (
                    <th key={title} className="px-4 py-2 text-left font-medium text-gray-700">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">{companydata?.name}</td>
                  <td className="px-4 py-2">{companydata?.email}</td>
                  <td className="px-4 py-2">{companydata?.phone}</td>
                  <td className="px-4 py-2">{companydata?.address}</td>
                  <td className="px-4 py-2">{companydata?.bio}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Plan Details */}
      <main className="w-11/12 mx-auto mb-10">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-center text-2xl font-semibold mb-6">Plan Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Label","Price","Job Limit","Featured Job Limit","Highlight Job Limit","Recommended","Frontend Show","Profile Verify","Home","Created At","Updated At"].map((title) => (
                    <th key={title} className="px-4 py-2 text-left font-medium text-gray-700">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">{plandata?.leble}</td>
                  <td className="px-4 py-2">{plandata?.price}</td>
                  <td className="px-4 py-2">{plandata?.joblimit}</td>
                  <td className="px-4 py-2">{plandata?.featuredjoblimit}</td>
                  <td className="px-4 py-2">{plandata?.highlightjoblimit}</td>
                  <td className="px-4 py-2">{plandata?.recommended ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{plandata?.frontendshow ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{plandata?.profileverify ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{plandata?.home ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{new Date(plandata?.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(plandata?.updatedAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
