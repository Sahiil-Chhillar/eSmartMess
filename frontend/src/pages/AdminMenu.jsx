import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminMenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [editDay, setEditDay] = useState(null);
    const [formData, setFormData] = useState({ day: "", breakfast: "", lunch: "", dinner: "" });

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const fetchMenu = async () => {
        try {
            const res = await axios.get("https://smart-mess-backend.vercel.app/api/menu/get");
            const sortedData = res.data.sort((a, b) => weekDays.indexOf(a.day) - weekDays.indexOf(b.day));
            setMenu(sortedData);
        } catch (error) {
            toast.error("Failed to fetch menu.");
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editDay) {
                await axios.put(`https://smart-mess-backend.vercel.app/api/menu/update/${editDay}`, formData, { withCredentials: true });
                toast.success("Menu updated successfully");
            } else {
                await axios.post("https://smart-mess-backend.vercel.app/api/menu/add", formData, { withCredentials: true });
                toast.success("Menu added successfully");
            }
            setFormData({ day: "", breakfast: "", lunch: "", dinner: "" });
            setEditDay(null);
            fetchMenu();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error occurred");
        }
    };

    const handleEdit = (menuItem) => {
        setFormData(menuItem);
        setEditDay(menuItem.day);
    };

    const handleDelete = async (day) => {
        try {
            await axios.delete(`https://smart-mess-backend.vercel.app/api/menu/delete/${day}`, { withCredentials: true });
            toast.success("Menu deleted successfully");
            fetchMenu();
        } catch (error) {
            toast.error("Failed to delete menu");
        }
    };

    return (
        <>
            <Navbar showHamburger={true} />
            <div className="flex flex-col md:flex-row h-screen bg-gray-100">
                <AdminSidebar />
                <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-4">Manage Weekly Menu</h1>

                    <form onSubmit={handleAddOrUpdate} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Day</label>
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                disabled={!!editDay}
                                required
                            >
                                <option value="">Select a day</option>
                                {weekDays.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                        {["breakfast", "lunch", "dinner"].map((meal) => (
                            <div key={meal} className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">{meal}</label>
                                <input
                                    type="text"
                                    name={meal}
                                    value={formData[meal]}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    required
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {editDay ? "Update Menu" : "Add Menu"}
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto bg-white shadow-md rounded">
                            <thead className="bg-gray-200 text-gray-700 text-left">
                                <tr>
                                    <th className="px-4 py-2">Day</th>
                                    <th className="px-4 py-2">Breakfast</th>
                                    <th className="px-4 py-2">Lunch</th>
                                    <th className="px-4 py-2">Dinner</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menu.map((item) => (
                                    <tr key={item._id} className="border-t">
                                        <td className="px-4 py-2 font-semibold">{item.day}</td>
                                        <td className="px-4 py-2">{item.breakfast}</td>
                                        <td className="px-4 py-2">{item.lunch}</td>
                                        <td className="px-4 py-2">{item.dinner}</td>
                                        <td className="px-4 py-2 space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.day)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminMenuPage;
