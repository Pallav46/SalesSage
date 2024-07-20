import { useState } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import Subscription from '../Subscription';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get current route location

  // Extract chat ID from URL
  const currentChatId = parseInt(location.pathname.split('/').pop()) || null;

  const handleUpgradeClick = () => {
    setIsSubscriptionOpen(!isSubscriptionOpen);
  };

  const handleCloseClick = () => {
    setIsSubscriptionOpen(false);
  };

  const handleMenuItemClick = (index) => {
    navigate(`/chat/${index}`); // Navigate to the chat route
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-56' : 'w-0'}`}
      style={{ backgroundColor: '#020024', color: 'white' }}
    >
      {isSidebarOpen && (
        <>
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <button onClick={toggleSidebar} className="text-xl hover:text-gray-400">
              <FaArrowLeft />
            </button>
            <span className="text-lg font-semibold text-center flex-grow">Chat History</span>
          </div>
          <div className="flex-grow flex justify-center p-4 overflow-y-auto">
            <ul className="flex flex-col items-center space-y-2">
              {[...Array(10)].map((_, index) => (
                <li key={index} className="w-full text-center">
                  <a
                    href="#"
                    onClick={() => handleMenuItemClick(index + 1)} // Add click handler
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      currentChatId === index + 1 ? 'bg-blue-700' : 'hover:bg-blue-700'
                    }`}
                  >
                    Menu Item {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleUpgradeClick}
              className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full w-full transition-colors flex items-center justify-center"
            >
              <span className="flex items-center mr-2">
                {/* Add stars here if needed */}
              </span>
              Upgrade Plan
            </button>
            {isSubscriptionOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-20"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <div
                  className="text-black rounded-lg shadow-lg p-4 w-full max-w-4xl mx-4 sm:mx-0 relative"
                  style={{ maxHeight: '80vh', overflowY: 'auto' }}
                >
                  <button
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 text-black hover:text-gray-900"
                  >
                    <FaTimes size={24} />
                  </button>
                  <Subscription />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
