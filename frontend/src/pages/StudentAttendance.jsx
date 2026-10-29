import React from 'react';
import Navbar from '../components/Navbar';
import StudentSidebar from '../components/StudentSidebar';
import AttendanceTable from '../components/AttendanceTable';

const StudentAttendance = () => {
  return (
    <>
      <Navbar showHamburger={true} />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        {/* <div className="hidden md:block w-64 bg-white border-r border-gray-200"> */}
          <StudentSidebar />
        {/* </div> */}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 ">
          <AttendanceTable />
        </div>
      </div>
    </>
  );
};

export default StudentAttendance;
