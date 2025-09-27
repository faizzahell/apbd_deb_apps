import React from 'react';
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-0">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;