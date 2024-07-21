import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DropdownMenu from '../components/dashboard/DropdownMenu';
import Welcome from '../components/dashboard/Welcome';
import { FaArrowRight } from 'react-icons/fa';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-grow bg-blue-400 text-white transition-all duration-300">
        <header className="flex items-center p-4 relative">
          {!isSidebarOpen && (
            <button onClick={toggleSidebar} className="text-xl hover:text-gray-400">
              <FaArrowRight />
            </button>
          )}
          <div className="ml-6 text-2xl font-bold">
            SalesSage
          </div>
          <DropdownMenu />
        </header>
        <Welcome />
      </div>
    </div>
  );
};

export default Dashboard;
