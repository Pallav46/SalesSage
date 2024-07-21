import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DropdownMenu from "../components/dashboard/DropdownMenu";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NewMessages from "../components/chat/NewMessges";// Ensure correct import
import InputMessage from "../components/dashboard/InputMessage"; // Ensure correct import

const NewChat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8000/ws/chat/');
    
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
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
      ws.send(JSON.stringify({ message, file: file ? file.name : null }));
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, file: file ? file.name : null, type: 'sent' }
      ]);
    }
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
          <NewMessages messages={messages} />
        </div>
        <InputMessage onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default NewChat;
