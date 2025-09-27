import React from 'react';
import SourceData from "../components/sourceData";
import Sidebar from "../components/Sidebar";

const SourcePage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-0">
        <SourceData />
      </div>
    </div>
  );
};

export default SourcePage;