import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";

const StudentComplaints = () => {
    const user = useSelector((state) => state.auth.user);
    const [description, setDescription] = useState("");
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get("https://smart-mess-backend.vercel.app/api/complaint/my-complaints", {
                withCredentials: true,
            });
            console.log("Fetched complaints:", res);
            setComplaints(res.data);
        } catch (err) {
            console.error("Failed to fetch complaints:", err);
            toast.error("Error fetching complaints");
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) return toast.warn("Complaint cannot be empty");

        try {
            setLoading(true);
            const res = await axios.post(
                "https://smart-mess-backend.vercel.app/api/complaint/create",
                { description },
                { withCredentials: true }
            );
            toast.success("Complaint submitted");
            setDescription("");
            fetchComplaints(); // Refresh complaints list
        } catch (err) {
            console.error("Error submitting complaint:", err);
            toast.error(err.response?.data?.message || "Error submitting complaint");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar showHamburger={true} />
            <div className="flex bg-gray-100 h-screen">
                <StudentSidebar />

                <div className="flex-1 p-6 overflow-y-scroll">
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">File a Complaint</h2>

                        <form onSubmit={handleSubmit} className="mb-8">
                            <textarea
                                rows="4"
                                className="w-full p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe your issue..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? "Submitting..." : "Submit Complaint"}
                            </button>
                        </form>

                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Complaints</h3>

                        {complaints.length === 0 ? (
                            <p className="text-gray-500">No complaints filed yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {complaints.map((complaint) => (
                                    <div
                                        key={complaint._id}
                                        className="border p-4 rounded-lg shadow-sm bg-gray-50"
                                    >
                                        <p className="text-gray-800">{complaint.description}</p>
                                        <div className="text-sm text-gray-500 mt-2 flex justify-between">
                                            <span>Status: {complaint.status}</span>
                                            <span>
                                                {new Date(complaint.createdAt).toLocaleString("en-IN", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentComplaints;
