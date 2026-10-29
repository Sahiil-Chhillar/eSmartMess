import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { toggleSidebar } from '../redux/slices/sidebarSlice'
import { Menu } from 'lucide-react';
import { useDispatch } from "react-redux";

const Navbar = ({ showHamburger = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfileClick = () => {
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      {/* Left: SmartMess Logo */}
      <h1
        className="text-2xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        SmartMess
      </h1>

      <div className="flex items-center space-x-4">
        {/* Right: Profile Icon */}
        <FaUserCircle
          size={30}
          className="text-gray-700 cursor-pointer"
          onClick={handleProfileClick}
        />
        {showHamburger ? (
          <button className="md:hidden" onClick={() => dispatch(toggleSidebar())}>
            <Menu size={24} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
