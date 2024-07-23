// context/WebSocketProvider.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth to get companyId

// Create WebSocketContext
const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { companyId } = useAuth(); // Get companyId from AuthContext
  const [status, setStatus] = useState(null); // State to store WebSocket messages

  useEffect(() => {
    if (!companyId) return; // Don't connect if companyId is not available

    const ws = new WebSocket(`ws://localhost:8000/ws/training_status/${companyId}/`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      setStatus(data); // Update state with received data
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close(); // Clean up WebSocket connection on unmount
    };
  }, [companyId]);

  return (
    <WebSocketContext.Provider value={{ status }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocketContext
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
