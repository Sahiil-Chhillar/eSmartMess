import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const StudentMenu = () => {
  const [menu, setMenu] = useState([]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("https://smart-mess-backend.vercel.app/api/menu/get");
      const sorted = [...res.data].sort(
        (a, b) => weekdays.indexOf(a.day) - weekdays.indexOf(b.day)
      );
      setMenu(sorted);
    } catch (error) {
      toast.error("Failed to load menu");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen bg-gray-100">
        <StudentSidebar />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6">Weekly Mess Menu</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-blue-100 text-gray-800 text-left">
                  <tr>
                    <th className="px-4 py-2">Day</th>
                    <th className="px-4 py-2">Breakfast</th>
                    <th className="px-4 py-2">Lunch</th>
                    <th className="px-4 py-2">Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-2 font-semibold">{item.day}</td>
                      <td className="px-4 py-2">{item.breakfast}</td>
                      <td className="px-4 py-2">{item.lunch}</td>
                      <td className="px-4 py-2">{item.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMenu;