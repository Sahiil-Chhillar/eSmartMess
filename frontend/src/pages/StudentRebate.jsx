import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import StudentSidebar from '../components/StudentSidebar';

const StudentRebate = () => {
  const user = useSelector((state) => state.auth.user);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pastRebates, setPastRebates] = useState([]);

  const fetchPastRebates = async () => {
    try {
      const res = await axios.get('https://smart-mess-backend.vercel.app/api/rebate/my-rebates', {
        withCredentials: true,
      });
      setPastRebates(res.data);
    } catch (err) {
      console.error("Error fetching past rebates", err);
    }
  };

  useEffect(() => {
    fetchPastRebates();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'https://smart-mess-backend.vercel.app/api/rebate/apply',
        { startDate, endDate },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      setStartDate('');
      setEndDate('');
      fetchPastRebates();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply for rebate");
    }
  };

  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <StudentSidebar />

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Apply Box */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Apply for Rebate</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Submit Rebate Request
                </button>
              </form>
            </div>

            {/* Past Rebates */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Past Rebate Requests</h2>
              {pastRebates.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {pastRebates.map((rebate) => (
                    <li key={rebate._id} className="py-3 flex justify-between items-center">
                      <div className='flex justify-between w-full'>
                        <p className="text-gray-700">
                          <strong>{new Date(rebate.startDate).toLocaleDateString()}</strong> to <strong>{new Date(rebate.endDate).toLocaleDateString()}</strong>
                        </p>
                        <p className="text-sm text-gray-500">Status: {rebate.status}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No rebate requests yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRebate;
