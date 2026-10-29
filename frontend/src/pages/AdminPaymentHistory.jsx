import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://smart-mess-backend.vercel.app/api/payments/all", {
        params: { page, limit: 50 },
        withCredentials: true,
      });
      setPayments(res.data.payments || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch payments.");
      setPayments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Payment History
          </h1>

          {loading ? (
            <p>Loading payments...</p>
          ) : payments.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-lg text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount (₹)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Transaction ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay) => (
                    <tr key={pay._id} className="text-center border-t border-gray-300">
                      <td className="border border-gray-300 px-4 py-2 text-left">
                        {pay.studentId?.name || "Unknown"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-left">{pay.amount}</td>
                      <td className="border border-gray-300 px-4 py-2 text-left">{pay.status}</td>
                      <td className="border border-gray-300 px-4 py-2 text-left">{pay.orderId}</td>
                      <td className="border border-gray-300 px-4 py-2 text-left">{pay.transactionId}</td>
                      <td className="border border-gray-300 px-4 py-2 text-left">
                        {new Date(pay.paymentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPaymentHistory;
