import React, { useEffect, useState, useRef } from 'react';

const NewMessages = ({ userMessage, accumulatedMessage, onResponseComplete }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (userMessage) {
      setDisplayedMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', message: userMessage }
      ]);
      setCurrentMessage('');
    }
  }, [userMessage]);

  useEffect(() => {
    let index = 0;
    let newMessage = '';
    
    if (accumulatedMessage.length > 0) {
      const combinedMessage = accumulatedMessage.map(msg => msg.message).join(' ');

      const interval = setInterval(() => {
        if (index < combinedMessage.length) {
          newMessage += combinedMessage[index];
          setCurrentMessage(newMessage);
          index++;
        } else {
          clearInterval(interval);
          setDisplayedMessages(prevMessages => [
            ...prevMessages,
            { type: 'ai', message: newMessage }
          ]);
          setCurrentMessage('');
          onResponseComplete();
        }
      }, 10); // Adjust the speed as needed
      return () => clearInterval(interval);
    }
  }, [accumulatedMessage, onResponseComplete]);

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages, currentMessage]);

  return (
    <div className="flex flex-col space-y-2 overflow-auto h-full">
      {displayedMessages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 rounded-lg ${
            msg.type === 'user' ? 'bg-gray-300 text-black self-end' : 'bg-blue-500 text-white self-start'
          }`}
        >
          <p>{msg.message}</p>
        </div>
      ))}
      {currentMessage && (
        <div className="p-2 rounded-lg bg-blue-500 text-white self-start">
          <p>{currentMessage}</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default NewMessages;