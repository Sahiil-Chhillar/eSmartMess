import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const endpoint = showPendingOnly
        ? "https://smart-mess-backend.vercel.app/api/complaint/pending"
        : "https://smart-mess-backend.vercel.app/api/complaint/all";

      const res = await axios.get(endpoint, {
        withCredentials: true,
      });

      setComplaints(res.data);
    } catch (err) {
      toast.error("Failed to fetch complaints.");
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (id) => {
    try {
      await axios.put(
        `https://smart-mess-backend.vercel.app/api/complaint/resolve/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Complaint marked as resolved.");
      fetchComplaints();
    } catch (err) {
      toast.error("Failed to mark complaint as resolved.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [showPendingOnly]);

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Manage Complaints
            </h1>
            <button
              onClick={() => setShowPendingOnly((prev) => !prev)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-max"
            >
              {showPendingOnly ? "Show All" : "Show Pending Only"}
            </button>
          </div>

          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table View */}
              <table className="min-w-full bg-white shadow-md rounded-lg hidden md:table">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-3 px-4 text-left">Student Name</th>
                    <th className="py-3 px-4 text-left">Complaint</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="border-t">
                      <td className="py-3 px-4">
                        {complaint.studentId?.name || "Unknown"}
                      </td>
                      <td className="py-3 px-4">{complaint.description}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            complaint.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {complaint.status === "Pending" && (
                          <button
                            onClick={() => markResolved(complaint._id)}
                            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="space-y-4 md:hidden">
                {complaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="bg-white p-4 rounded-lg shadow-md border"
                  >
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {complaint.studentId?.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-semibold">Complaint:</span>{" "}
                      {complaint.description}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          complaint.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                    {complaint.status === "Pending" && (
                      <button
                        onClick={() => markResolved(complaint._id)}
                        className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminComplaint;
