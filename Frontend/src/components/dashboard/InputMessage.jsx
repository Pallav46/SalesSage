import { useState } from 'react';
import { FaPaperclip, FaArrowUp, FaTimes } from 'react-icons/fa';

const InputMessage = ({ onSendMessage }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    onSendMessage(message, file);
    setMessage('');
    setFile(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex items-center w-11/12 md:w-3/4 lg:w-1/2 bg-gray-100 text-gray-700 p-2 rounded-full">
        <input
          type="file"
          accept=".csv, .xlsx, .xls, .xlsm"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer text-blue-900 p-2 hover:text-gray-400">
          <FaPaperclip className="text-xl" />
        </label>
        <input
          type="text"
          placeholder="Type Something..."
          value={message}
          onChange={handleMessageChange}
          className="flex-grow bg-transparent outline-none px-4"
        />
        <button
          onClick={handleSendMessage}
          className="text-blue-900 p-2 hover:text-gray-400"
        >
          <FaArrowUp className="text-xl" />
        </button>
      </div>
      {file && (
        <div className="flex items-center mt-2">
          <span className="mr-2">{file.name}</span>
          <button onClick={handleRemoveFile} className="text-red-600 hover:text-red-800">
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default InputMessage;
