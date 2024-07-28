import React, { useEffect, useState, useCallback } from 'react';
import DropdownMenu from "../components/dashboard/DropdownMenu";
import Welcome from "../components/dashboard/Welcome";
import Loader from "../components/dashboard/Loader";
import FileProcessing from "../components/dashboard/FileProcessing";
import SalesReport from "../components/report/SalesReport";
import ErrorDisplay from "../components/ErrorDisplay.jsx";
import Cookies from "js-cookie";
import axios from 'axios';
import useWebSocket from '../hooks/useWebSocket';

const Dashboard = ({ company_id }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  const { status: webSocketStatus, error: webSocketError } = useWebSocket(
    company_id ? `ws://localhost:8000/ws/training_status/${company_id}/` : null
  );

  const fetchUserData = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const response = await axios.get("http://localhost:8000/accounts/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setFetchError(error.response?.data?.message || error.message || "An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const renderContent = useCallback(() => {
    if (webSocketError || fetchError) {
      return <ErrorDisplay error={webSocketError || fetchError} />;
    }

    if (webSocketStatus?.message === 'Model running') {
      return <FileProcessing />;
    } else if (webSocketStatus?.message === 'success') {
      return <SalesReport />;
    } else if(webSocketStatus?.message){
      return <ErrorDisplay error={webSocketStatus.message} />
    }

    if (!userData) return null;

    const { file_available, predictions_available } = userData;
    if (file_available && !predictions_available) {
      return <FileProcessing />;
    } else if (!file_available && !predictions_available) {
      return <Welcome userData={userData} />;
    } else {
      return <SalesReport />;
    }
  }, [webSocketStatus, webSocketError, fetchError, userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-white bg-[#020024]">
        <Loader />
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
        <div className="overflow-y-auto md:pb-0">
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