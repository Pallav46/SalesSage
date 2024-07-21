import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DropdownMenu from '../components/dashboard/DropdownMenu';
import InputMessage from '../components/dashboard/InputMessage'
import NewMessages from '../components/chat/NewMessges';

const NewChat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [accumulatedMessage, setAccumulatedMessage] = useState([]);
  const [ws, setWs] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8000/ws/chat/');

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAccumulatedMessage((prevMessages) => [
        ...prevMessages,
        data,
      ]);
    };

    setWs(webSocket);
    return () => {
      webSocket.close();
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleSendMessage = (message, file) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setIsResponding(true);
      setUserMessage(message);
      setAccumulatedMessage([]);
      ws.send(JSON.stringify({ message, file: file ? file.name : null }));
    }
  };

  const handleResponseComplete = () => {
    setIsResponding(false);
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
        <div className="flex-grow p-4 overflow-auto">
          <NewMessages 
            userMessage={userMessage} 
            accumulatedMessage={accumulatedMessage} 
            onResponseComplete={handleResponseComplete} 
          />
        </div>
        <InputMessage onSendMessage={handleSendMessage} isDisabled={isResponding} />
      </div>
    </div>
  );
};

export default NewChat;