import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useTheme } from "../ThemeContext";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "dark" : ""
      } bg-gradient-to-br from-gray-900 to-blue-800 text-white`}
    >
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <FaUserCircle size={30} />
          <span className="hidden md:inline">User Profile</span>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gradient-to-b from-blue-700 to-purple-700 p-4 hidden md:block">
          <h2 className="text-lg font-semibold mb-4">Chat History</h2>
          <ul>
            <li className="mb-2 p-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
              Chat Item 1
            </li>
            <li className="mb-2 p-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
              Chat Item 2
            </li>
            <li className="mb-2 p-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
              Chat Item 3
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-4 flex flex-col items-center">
          <div className="bg-gradient-to-b from-blue-800 to-purple-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Upload a File
            </h2>
            <input
              type="file"
              accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="mb-4 p-2 w-full text-gray-800 rounded"
            />
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                onClick={() => {
                  // Predict sales data functionality
                }}
              >
                Predict Sales Data
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                onClick={() => {
                  // Chat related to file functionality
                }}
              >
                Chat About File
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
