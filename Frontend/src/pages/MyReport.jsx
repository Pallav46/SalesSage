import React from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from '../components/dashboard/DropdownMenu';
import SalesTable from '../components/report/SalesTable';

const MyReport = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff]">
      <header className="bg-[#020024] text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center w-1/3">
          <button 
            onClick={handleBackClick} 
            className="text-white hover:text-[#00D4FF] font-bold focus:outline-none transition duration-300 mr-4"
          >
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold w-1/3 text-center">SalesSage</h1>
        <div className="w-1/3 flex justify-end">
          <DropdownMenu />
        </div>
      </header>

      <main className="flex-grow p-6">
        <h2 className="text-2xl font-semibold text-[#00D4FF] text-center mb-6">Sales Report</h2>
        <div className="overflow-hidden">
          <SalesTable />
        </div>
      </main>

      <footer className="bg-[#020024] bg-opacity-80 text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} SalesSage. All rights reserved.
      </footer>
    </div>
  );
};

export default MyReport;