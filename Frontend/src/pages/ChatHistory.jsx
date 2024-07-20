import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DropdownMenu from "../components/dashboard/DropdownMenu";
import { FaArrowRight } from "react-icons/fa"; // Import palm icon
import Messages from "../components/chat/Messages";
import { useNavigate } from "react-router-dom";

const ChatHistory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleBackClick = () => {
    navigate("/dashboard"); // Navigate to /dashboard
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-grow bg-blue-400 text-white transition-all duration-300">
        <header className="flex items-center p-4 relative">
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="text-xl hover:text-gray-400"
            >
              <FaArrowRight />
            </button>
          )}
          <button 
            onClick={handleBackClick}
            className="flex items-center ml-6 text-2xl font-bold hover:text-gray-400 cursor-pointer"
          >
            Back
          </button>
          <DropdownMenu />
        </header>
        <Messages />
      </div>
    </div>
  );
};

export default ChatHistory;
