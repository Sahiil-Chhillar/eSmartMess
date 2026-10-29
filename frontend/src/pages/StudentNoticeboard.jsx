import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

const StudentNoticeboard = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://smart-mess-backend.vercel.app/api/notice/all", {
                withCredentials: true,
            });
            setNotices(res.data);
        } catch (err) {
            console.error("Failed to fetch notices:", err);
            toast.error("Error fetching notices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    return (
        <>
            <Navbar showHamburger={true} />
            <div className="flex bg-gray-100 h-screen">
                <StudentSidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Noticeboard</h2>
                        {loading ? (
                            <p>Loading notices...</p>
                        ) : notices.length === 0 ? (
                            <p className="text-gray-600">No notices available at the moment.</p>
                        ) : (
                            <ul className="space-y-6">
                                {notices.map(({ _id, title, content, createdAt }) => (
                                    <li
                                        key={_id}
                                        className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                                    >
                                        <h3 className="text-xl font-semibold text-blue-700">{title}</h3>
                                        <p className="mt-2 text-gray-700 whitespace-pre-line">{content}</p>
                                        <p className="mt-3 text-sm text-gray-500 italic">
                                            Posted on:{" "}
                                            {new Date(createdAt).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default StudentNoticeboard;
