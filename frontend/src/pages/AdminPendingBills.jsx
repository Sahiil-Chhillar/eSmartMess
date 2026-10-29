import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

const PER_DAY_COST = 105;

const AdminPendingBills = () => {
  const [pendingBills, setPendingBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBills = async () => {
    try {
      const res = await axios.get("https://smart-mess-backend.vercel.app/api/attendance/pending", {
        withCredentials: true,
      });
      setPendingBills(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch pending bills.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBills();
  }, []);

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Pending Bills
          </h1>

          {loading ? (
            <p>Loading pending bills...</p>
          ) : pendingBills.length === 0 ? (
            <p>No pending bills found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-lg text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Unbilled Attendance Dates</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total Unbilled Days</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount Due (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBills.map(({ student, attendanceDates }) => {
                    const daysCount = attendanceDates.length;
                    const amountDue = daysCount * PER_DAY_COST;
                    return (
                      <tr key={student._id} className="border-t border-gray-300">
                        <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {attendanceDates
                            .map((d) => new Date(d).toLocaleDateString())
                            .join(", ")}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{daysCount}</td>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">₹ {amountDue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPendingBills;
