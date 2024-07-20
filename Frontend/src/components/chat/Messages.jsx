import { useState } from "react";

const Messages = () => {
  const [messages] = useState([
    { id: 1, text: "Hello, how can I help you today?", sender: "bot" },
    { id: 2, text: "I have a question about your services.", sender: "user" },
    { id: 3, text: "Sure, feel free to ask!", sender: "bot" },
  ]);

  const handleNewChat = () => {
    // Logic to start a new chat or open a new chat window
    alert("New chat started!");
  };

  return (
    <div className="flex flex-col flex-grow p-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-black">
      <div className="flex-grow overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center border-t border-gray-300 pt-2 justify-center">
        <button
          onClick={handleNewChat}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default Messages;
