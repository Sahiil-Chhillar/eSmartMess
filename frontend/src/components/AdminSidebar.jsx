import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
    const isOpen = useSelector((state) => state.sidebar.isOpen);

    return (
        <div
            className={`bg-gray-900 text-white w-64 h-full px-6 py-8 fixed md:static transition-transform duration-300 z-20 ${isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
        >
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <ul className="space-y-6 mt-8 text-xl">
                <li>
                    <Link to="/admin/dashboard" className="hover:text-gray-300">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/admin/rebates" className="hover:text-gray-300">
                        Manage Rebates
                    </Link>
                </li>
                <li>
                    <Link to="/admin/complaints" className="hover:text-gray-300">
                        Manage Complaints
                    </Link>
                </li>
                <li>
                    <Link to="/admin/notices" className="hover:text-gray-300">
                        Noticeboard
                    </Link>
                </li>
                <li>
                    <Link to="/admin/payments" className="hover:text-gray-300">
                        Payment History
                    </Link>
                </li>
                <li>
                    <Link to="/admin/pendingBills" className="hover:text-gray-300">
                        Pending Bills
                    </Link>
                </li>
                <li>
                    <Link to="/admin/menu" className="hover:text-gray-300">
                        Manage Menu
                    </Link>
                </li>
                {/* Add more admin links as needed */}
            </ul>
        </div>
    );
};

export default AdminSidebar;
