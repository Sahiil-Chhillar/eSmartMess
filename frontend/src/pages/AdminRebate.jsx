import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminRebate = () => {
  const [rebates, setRebates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRebates = async () => {
    try {
      const res = await axios.get("https://smart-mess-backend.vercel.app/api/rebate/all", {
        withCredentials: true,
      });
      setRebates(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch rebate requests.");
      setLoading(false);
    }
  };

  const updateRebateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://smart-mess-backend.vercel.app/api/rebate/update/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Rebate ${status.toLowerCase()} successfully.`);
      fetchRebates();
    } catch (err) {
      toast.error("Error updating rebate status.");
    }
  };

  useEffect(() => {
    fetchRebates();
  }, []);

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Manage Rebates
          </h1>

          {loading ? (
            <p>Loading rebate requests...</p>
          ) : rebates.length === 0 ? (
            <p>No rebate requests found.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[700px] md:min-w-full bg-white shadow-md rounded-lg text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-3 md:py-3 md:px-4 text-left">Student Name</th>
                    <th className="py-2 px-3 md:py-3 md:px-4 text-left">Email</th>
                    <th className="py-2 px-3 md:py-3 md:px-4 text-left">Start Date</th>
                    <th className="py-2 px-3 md:py-3 md:px-4 text-left">End Date</th>
                    <th className="py-2 px-3 md:py-3 md:px-4 text-left">Status</th>
                    <th className="py-2 px-3 md:py-3 md:px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rebates.map((rebate) => (
                    <tr key={rebate._id} className="border-t">
                      <td className="py-2 px-3 md:py-3 md:px-4">
                        {rebate.studentId?.name}
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4">
                        {rebate.studentId?.email}
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4">
                        {new Date(rebate.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4">
                        {new Date(rebate.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${
                            rebate.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : rebate.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {rebate.status || "Pending"}
                        </span>
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4 space-y-1 md:space-y-0 md:space-x-2">
                        {rebate.status === "Pending" && (
                          <div className="flex flex-col md:flex-row gap-2">
                            <button
                              onClick={() =>
                                updateRebateStatus(rebate._id, "Approved")
                              }
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs md:text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateRebateStatus(rebate._id, "Rejected")
                              }
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs md:text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRebate;
