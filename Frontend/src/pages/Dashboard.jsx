import React, { useEffect, useState } from 'react';
import DropdownMenu from "../components/dashboard/DropdownMenu";
import Welcome from "../components/dashboard/Welcome";
import Loader from "../components/dashboard/Loader";
import FileProcessing from "../components/dashboard/FileProcessing";
import SalesReport from "../components/report/SalesReport";
import { FaArrowRight } from "react-icons/fa";
import Cookies from "js-cookie";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webSocketStatus, setWebSocketStatus] = useState(null);

  const { companyId } = useAuth();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get("http://localhost:8000/accounts/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Setup WebSocket connection and handle messages
  useEffect(() => {
    if (companyId) {
      const ws = new WebSocket(`ws://localhost:8000/ws/training_status/${companyId}/`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        setWebSocketStatus(data);
      };
      return () => ws.close();
    }
  }, [companyId]);

  // Determine which component to render based on the state
  const renderContent = () => {
    if (webSocketStatus) {
      if (webSocketStatus.message === 'Model running') {
        return <FileProcessing />;
      } else if (webSocketStatus.message === 'success') {
        return <SalesReport />;
      }
    }

    const { file_available, predictions_available } = userData || {};
    if (file_available && !predictions_available) {
      return <FileProcessing />;
    } else if (!file_available && !predictions_available) {
      return <Welcome userData={userData} />;
    } else {
      return <SalesReport />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-white bg-[#020024]">
        <Loader />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-[#00D4FF] bg-[#020024]">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-y-auto">
      <div className="flex flex-col flex-grow bg-gradient-to-r from-color-300 via-color-400 to-color-300 text-white">
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-[#00D4FF] hover:text-[#00D4FF]">
              SalesSage
            </a>
          </div>
          <DropdownMenu />
        </header>
        <div className=" overflow-y-auto  md:pb-0">
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
