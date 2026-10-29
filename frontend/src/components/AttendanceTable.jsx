import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceTable = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get("https://smart-mess-backend.vercel.app/api/attendance/my-attendance", {
                    withCredentials: true, // Important: this sends the cookie
                });

                setAttendanceData(res.data.attendance);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch attendance.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading attendance...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!attendanceData.length) return <p className="text-center text-gray-600">No attendance records found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-4">My Attendance</h1>
            <div className="overflow-x-auto shadow rounded-lg border border-gray-200 mt-6">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Billed</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {attendanceData.map((record) => (
                            <tr key={record._id}>
                                <td className="px-4 py-2 text-gray-800">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className={`px-4 py-2 font-medium ${record.status === "present" ? "text-green-600" : "text-red-500"}`}>
                                    {record.status}
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                    {record.is_billed ? "Yes" : "No"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;
