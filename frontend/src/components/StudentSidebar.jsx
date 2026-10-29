import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const StudentSidebar = () => {
    const isOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <div className={`bg-gray-800 text-white w-64 h-full px-6 py-8 fixed md:static transition-transform duration-300 z-20 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <h2 className="text-2xl font-bold mb-4">Student Panel</h2>
      <ul className="space-y-6 mt-8 text-xl">
        <li><Link to="/student/dashboard">Dashboard</Link></li>
        <li><Link to="/student/attendance">View Attendance</Link></li>
        <li><Link to="/student/rebates">Apply Rebate</Link></li>
        <li><Link to="/student/complaint">File Complaint</Link></li>
        <li><Link to="/student/noticeboard">Noticeboard</Link></li>
        <li><Link to="/student/menu">View Menu</Link></li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
