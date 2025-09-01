"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Orders() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/orders`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        setTransactions(data);
        setFilteredTransactions(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = transactions.filter((t) =>
      t.package_name.toLowerCase().includes(keyword) ||
      t.payment_provider.toLowerCase().includes(keyword) ||
      t.transaction_id.toLowerCase().includes(keyword) ||
      t.order_id.toLowerCase().includes(keyword) ||
      t.amount.toString().includes(keyword) ||
      t.paid_in_currency.toLowerCase().includes(keyword) ||
      t.default_amount.toString().includes(keyword) ||
      new Date(t.createdAt).toLocaleDateString().includes(keyword) ||
      new Date(t.updatedAt).toLocaleDateString().includes(keyword)
    );
    setFilteredTransactions(filtered);
  };

  const handleShowDetails = (id: string) => {
    router.push(`/dashboards/jobs/admin/orders/details/?id=${id}`);
  };

  return (
    <div className="w-11/12 mx-auto my-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">All Orders</h2>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFilter}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Package Name",
                  "Payment Provider",
                  "Transaction ID",
                  "Order ID",
                  "Amount",
                  "Paid in Currency",
                  "Default Amount",
                  "Payment Status",
                  "Created At",
                  "Updated At",
                  "Action",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-4 py-2 text-left font-medium text-gray-700"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{transaction.package_name}</td>
                  <td className="px-4 py-2">{transaction.payment_provider}</td>
                  <td className="px-4 py-2">{transaction.transaction_id}</td>
                  <td className="px-4 py-2">{transaction.order_id}</td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">{transaction.paid_in_currency}</td>
                  <td className="px-4 py-2">{transaction.default_amount}</td>
                  <td className="px-4 py-2">{transaction.payment_status}</td>
                  <td className="px-4 py-2">{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(transaction.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleShowDetails(transaction.order_id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center px-4 py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
