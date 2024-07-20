import { useState } from 'react';
import { FaPaperclip, FaArrowUp } from 'react-icons/fa';

const InputMessage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
          className="flex-grow bg-transparent outline-none px-4"
        />
        <button className="text-blue-900 p-2 hover:text-gray-400">
          <FaArrowUp className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default InputMessage;
