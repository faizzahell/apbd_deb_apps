import React from 'react';
import AccountProfile from "../components/AccountProfile";
import Sidebar from "../components/Sidebar";

const AccountPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-0">
        <AccountProfile />
      </div>
    </div>
  );
};

export default AccountPage;