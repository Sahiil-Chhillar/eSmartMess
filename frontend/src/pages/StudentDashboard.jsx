import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import StudentSidebar from '../components/StudentSidebar';
import Navbar from '../components/Navbar';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [billInfo, setBillInfo] = useState(null);

  const fetchBill = async () => {
    try {
      const response = await axios.get(`https://smart-mess-backend.vercel.app/api/attendance/bill`, {
        params: { studentId: user._id },
        withCredentials: true,
      });
      setBillInfo(response.data);
    } catch (err) {
      console.error("Failed to fetch bill:", err);
    }
  };

  useEffect(() => {
    if (user) fetchBill();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post('https://smart-mess-backend.vercel.app/api/user/logout', {}, {
        withCredentials: true,
      });

      Cookies.remove('token');
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePay = async () => {
    try {
      const res = await axios.post(
        "https://smart-mess-backend.vercel.app/api/payments/create-order",
        { studentId: user._id, amount: billInfo.amountDue * 100 },
        { withCredentials: true }
      );

      if (res.data.success) {
        const { order } = res.data;
        openRazorpayModal(order);
      }
    } catch (error) {
      console.error("Error creating Razorpay order", error);
    }
  };

  const openRazorpayModal = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Hostel Mess Payment",
      description: "Mess Bill Payment",
      order_id: order.id,
      handler: async (response) => {
        await verifyPayment(response, order);
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (response, order) => {
    try {
      const verifyRes = await axios.post(
        "https://smart-mess-backend.vercel.app/api/payments/verify-payment",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          studentId: user._id,
          amount: order.amount,
        },
        { withCredentials: true }
      );

      if (verifyRes.data.success) {
        toast.success("Payment successful!");
        // Re-fetch bill info from backend
        await fetchBill();
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      console.error("Payment verification error", error);
      toast.error("Error verifying payment.");
    }
  };

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <StudentSidebar />

        <div className="flex-1 flex justify-center h-fit p-6">
          <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h2>

            {/* Student Info */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Roll No:</strong> {user?.studentRollNo}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            </div>

            {/* Bill Info */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Bill</h3>
              {billInfo ? (
                <div className="text-gray-800 space-y-2">
                  <p><strong>Unpaid Present Days:</strong> {billInfo.totalDaysPresent}</p>
                  <p><strong>Amount Due:</strong> ₹{billInfo.amountDue}</p>
                </div>
              ) : (
                <p className="text-gray-500">Loading bill info...</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handlePay}
                className="flex-1 px-6 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
              >
                Pay Now
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
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

export default StudentDashboard;
