// useWebSocket.js
import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    if (!url) return;

    const connectWebSocket = () => {
      ws.current = new WebSocket(url);
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);
          if (data.error) {
            setError(data.error);
          } else {
            setStatus(data);
            setError(null);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setError("Error parsing WebSocket message");
        }
      };
      
      ws.current.onopen = () => {
        console.log("WebSocket connected.");
        setError(null);
      };
      
      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected. Reconnecting...", event.reason);
        setError("WebSocket disconnected. Attempting to reconnect...");
        setTimeout(connectWebSocket, 3000);
      };
      
      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket error occurred");
      };
    };

    connectWebSocket();
  
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return { status, error };
};

export default useWebSocket;