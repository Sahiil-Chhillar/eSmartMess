import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireGuest from './components/RequireGuest';
import { useDispatch } from 'react-redux';
import { fetchUser } from './redux/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentAttendance from './pages/StudentAttendance';
import StudentComplaint from './pages/StudentComplaint';
import StudentNoticeboard from './pages/StudentNoticeboard';
import AdminRebate from './pages/AdminRebate';
import StudentRebate from './pages/StudentRebate';
import AdminComplaint from './pages/AdminComplaint';
import AdminNotice from './pages/AdminNotice';
import AdminPaymentHistory from './pages/AdminPaymentHistory';
import AdminPendingBills from './pages/AdminPendingBills';
import AdminMenu from './pages/AdminMenu';
import StudentMenu from './pages/StudentMenu';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser()); // check cookie and set user in Redux
  }, [dispatch]);
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={<Home />} />

        <Route
          path="/login"
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />
        <Route
          path="/register"
          element={
            <RequireGuest>
              <Register />
            </RequireGuest>
          }
        />

        {/* Student-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/rebates" element={<StudentRebate />} />
          <Route path="/student/complaint" element={<StudentComplaint />} />
          <Route path="/student/noticeboard" element={<StudentNoticeboard />} />
          <Route path="/student/menu" element={<StudentMenu />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/rebates" element={<AdminRebate/>} />
          <Route path="/admin/complaints" element={<AdminComplaint />} />
          <Route path="/admin/notices" element={<AdminNotice />} />
          <Route path="/admin/payments" element={<AdminPaymentHistory />} />
          <Route path="/admin/pendingBills" element={<AdminPendingBills/>} />
          <Route path="/admin/menu" element={<AdminMenu />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App