"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Orders() {
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/orders`,
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        setTransactions(data);
        setFilteredTransactions(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyward = e.target.value.toLowerCase();

    const filtered = transactions.filter(
      (t) =>
        t.package_name.toLowerCase().includes(keyward) ||
        t.payment_provider.toLowerCase().includes(keyward) ||
        t.transaction_id.toLowerCase().includes(keyward) ||
        t.order_id.toLowerCase().includes(keyward) ||
        t.amount.toString().toLowerCase().includes(keyward) ||
        t.paid_in_currency.toLowerCase().includes(keyward) ||
        t.default_amount.toString().toLowerCase().includes(keyward) ||
        new Date(t.createdAt).toLocaleDateString().includes(keyward) ||
        new Date(t.updatedAt).toLocaleDateString().includes(keyward),
    );

    setFilteredTransactions(filtered);
  };

  const handleShowDetails = (id: string) => {
    router.push(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboards/jobs/company/orders/details/?id=${id}`,
    );
  };

  return (
    <div className="w-11/12 md:w-4/5 mx-auto my-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">All Orders</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleFilter}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
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
              ].map((th) => (
                <th
                  key={th}
                  className="px-4 py-3 text-left text-sm md:text-base font-semibold text-gray-700 border-b"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-2 border-b">{transaction.package_name}</td>
                <td className="px-4 py-2 border-b">{transaction.payment_provider}</td>
                <td className="px-4 py-2 border-b">{transaction.transaction_id}</td>
                <td className="px-4 py-2 border-b">{transaction.order_id}</td>
                <td className="px-4 py-2 border-b">{transaction.amount}</td>
                <td className="px-4 py-2 border-b">{transaction.paid_in_currency}</td>
                <td className="px-4 py-2 border-b">{transaction.default_amount}</td>
                <td className="px-4 py-2 border-b">{transaction.payment_status}</td>
                <td className="px-4 py-2 border-b">{new Date(transaction.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{new Date(transaction.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleShowDetails(transaction.order_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm md:text-base px-3 py-1 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
