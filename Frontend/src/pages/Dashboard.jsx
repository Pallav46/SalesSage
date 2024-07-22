import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/dashboard/Sidebar";
import DropdownMenu from "../components/dashboard/DropdownMenu";
import Welcome from "../components/dashboard/Welcome";
import Loader from "../components/dashboard/Loader";
import FileProcessing from "../components/dashboard/FileProcessing";
import SalesReport from "../components/report/SalesReport";
import { FaArrowRight } from "react-icons/fa";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get("http://localhost:8000/accounts/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-white bg-[#020024]">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-[#00D4FF] bg-[#020024]">
        Error: {error.message}
      </div>
    );

  // Conditional rendering based on userData
  const renderContent = () => {
    if (!userData) return null;

    const { file_available, predictions_available } = userData;

    if (file_available && !predictions_available) {
      return <FileProcessing />;
    } else if (!file_available && !predictions_available) {
      return <Welcome userData={userData} />;
    } else {
      // Render SalesReport or other components if needed
      return <SalesReport />;
    }
  };

  return (
    <div className="flex h-screen overflow-y-auto ">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex flex-col flex-grow bg-gradient-to-r from-color-300 via-color-400 to-color-300 text-white transition-all duration-300 ${
          isSidebarOpen ? "md:w-[calc(100%-250px)]" : "w-full"
        }`}
      >
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center">
            {!isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="text-xl text-[#00D4FF] hover:text-white mr-4"
              >
                <FaArrowRight />
              </button>
            )}
            <div className="text-2xl font-bold text-[#00D4FF]">SalesSage</div>
          </div>
          <DropdownMenu />
        </header>
        <div className="flex-grow overflow-y-auto pb-16 md:pb-0">
          {renderContent()}
        </div>
        <footer className="flex justify-center items-center w-full h-[5%] bg-[#020024] bg-opacity-80 text-[#fff] text-center text-sm absolute bottom-0">
          © {new Date().getFullYear()} SalesSage. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
