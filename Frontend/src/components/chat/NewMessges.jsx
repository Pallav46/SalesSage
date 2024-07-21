import React, { useEffect, useState } from 'react';

const NewMessages = ({ messages }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setDisplayedMessages((prevMessages) => [...prevMessages, messages[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500); // Adjust the delay as needed

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex flex-col space-y-2 overflow-auto h-full">
      {displayedMessages.map((msg, index) => {
        // Ensure msg is defined and has the expected properties
        if (!msg || typeof msg.type === 'undefined') {
          return null;
        }

        return (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.type === 'sent' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'
            }`}
          >
            <p>{msg.message || 'No message'}</p>
            {msg.file && (
              <a
                href={`/${msg.file}`}
                download
                className="text-blue-300 underline"
              >
                {msg.file}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NewMessages;
