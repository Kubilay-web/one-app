"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { generateOrderPDFBlob } from "./invoice";
import { Button } from "@/app/projects/components/ui/button";
import { Download } from "lucide-react";
import { OrderFullJobType } from "@/app/lib/types";
import { downloadBlobAsFile } from "@/app/lib/utils";

export default function CheckoutPage({ searchParams }: { searchParams: any }) {
  const [loading, setLoading] = useState(false);
  const id = searchParams?.id;
  const [details, setDetails] = useState([]);
  const [order, setOrder] = useState<OrderFullJobType | null>(null);
  const [companydata, setCompanyData] = useState(null);
  const [plandata, setPlansData] = useState(null);

  useEffect(() => {
    fetchdata();
  }, [id]);

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/orders/details/${id}`,
      );
      const data = await response.json();
      if (!response.ok) toast.error(data.err);
      else {
        setDetails(data);
        setOrder(data[0]);
        setCompanyData(data[0].company);
        setPlansData(data[0].plan);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async () => {
    if (!order) return toast.error("Sipariş bilgisi yüklenmedi");
    try {
      const pdfBlob = await generateOrderPDFBlob(order);
      downloadBlobAsFile(pdfBlob, `Order_${order.order_id}.pdf`);
    } catch (error) {
      console.error("PDF oluşturma hatası:", error);
      toast.error("PDF indirilirken bir hata oluştu");
    }
  };

  return (
    <>
      {/* Header Banner */}
      <div
        className="relative w-full h-48 md:h-60 bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/image/jobportal/dee.jpg")' }}
      >
        <div className="absolute top-5 left-5 text-white">
          <h6 className="text-sm md:text-base">Home &gt; dashboard &gt; admin &gt; orders &gt; details</h6>
        </div>
      </div>

      {/* Download Button */}
      <div className="w-11/12 md:w-4/5 mx-auto text-center my-6">
        {details.length > 0 && (
          <Button variant="outline" className="mb-4 flex items-center justify-center gap-2" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download Invoice
          </Button>
        )}
      </div>

      {/* Payment Details */}
      <section className="w-11/12 md:w-4/5 mx-auto mb-8">
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center py-4 border-b">Payment Details</h2>
          <table className="min-w-full text-left text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                {["Order ID", "Package Name", "Amount", "Default Amount", "Currency", "Payment Status", "Date"].map((th) => (
                  <th key={th} className="px-4 py-2 border-b">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {details.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{order.order_id}</td>
                  <td className="px-4 py-2 border-b">{order.package_name}</td>
                  <td className="px-4 py-2 border-b">{order.amount}</td>
                  <td className="px-4 py-2 border-b">{order.default_amount}</td>
                  <td className="px-4 py-2 border-b">{order.paid_in_currency}</td>
                  <td className="px-4 py-2 border-b">{order.payment_status}</td>
                  <td className="px-4 py-2 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Company Details */}
      <section className="w-11/12 md:w-4/5 mx-auto mb-8">
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center py-4 border-b">Company Details</h2>
          <table className="min-w-full text-left text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Address", "Bio"].map((th) => (
                  <th key={th} className="px-4 py-2 border-b">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">{companydata?.name}</td>
                <td className="px-4 py-2 border-b">{companydata?.email}</td>
                <td className="px-4 py-2 border-b">{companydata?.phone}</td>
                <td className="px-4 py-2 border-b">{companydata?.address}</td>
                <td className="px-4 py-2 border-b">{companydata?.bio}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Plan Details */}
      <section className="w-11/12 md:w-4/5 mx-auto mb-8">
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center py-4 border-b">Plan Details</h2>
          <table className="min-w-full text-left text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Label","Price","Job Limit","Featured Job Limit","Highlight Job Limit",
                  "Recommended","Frontend Show","Profile Verify","Home","Created At","Updated At"
                ].map((th) => (
                  <th key={th} className="px-4 py-2 border-b">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{plandata?.leble}</td>
                <td className="px-4 py-2 border-b">{plandata?.price}</td>
                <td className="px-4 py-2 border-b">{plandata?.joblimit}</td>
                <td className="px-4 py-2 border-b">{plandata?.featuredjoblimit}</td>
                <td className="px-4 py-2 border-b">{plandata?.highlightjoblimit}</td>
                <td className="px-4 py-2 border-b">{plandata?.recommended ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{plandata?.frontendshow ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{plandata?.profileverify ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{plandata?.home ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{new Date(plandata?.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">{new Date(plandata?.updatedAt).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
