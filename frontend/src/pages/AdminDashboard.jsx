import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import Navbar from '../components/Navbar';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingComplaints: 0,
    totalNotices: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://smart-mess-backend.vercel.app/api/user/stats', {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      toast.error('Error fetching dashboard stats');
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(
        'https://smart-mess-backend.vercel.app/api/user/logout',
        {},
        { withCredentials: true }
      );
      Cookies.remove('token');
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleMarkAllAttendance = async () => {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Normalize to UTC start of day

      const res = await axios.post(
        'https://smart-mess-backend.vercel.app/api/attendance/mark-all',
        { date: today },
        { withCredentials: true }
      );

      toast.success(res.data.message || 'Attendance marked for today!');
    } catch (error) {
      console.error('Mark attendance error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to mark attendance'
      );
    }
  };

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex md:h-screen min-h-screen bg-gray-100">
        <AdminSidebar />

        <div className="flex-1 flex justify-center h-fit p-6 overflow-y-auto">
          <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>

            {/* Admin Info */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Admin ID:</strong> {user?._id}</p>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Quick Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-blue-100 rounded-lg p-6 text-center shadow">
                  <p className="text-3xl font-bold text-blue-700">{stats.totalStudents}</p>
                  <p className="mt-2 text-gray-700 font-semibold">Total Students</p>
                </div>
                <div className="bg-yellow-100 rounded-lg p-6 text-center shadow">
                  <p className="text-3xl font-bold text-yellow-700">{stats.pendingComplaints}</p>
                  <p className="mt-2 text-gray-700 font-semibold">Pending Complaints</p>
                </div>
                <div className="bg-green-100 rounded-lg p-6 text-center shadow">
                  <p className="text-3xl font-bold text-green-700">{stats.totalNotices}</p>
                  <p className="mt-2 text-gray-700 font-semibold">Notices</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={handleMarkAllAttendance}
                className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
              >
                Mark Attendance for Today
              </button>

              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
