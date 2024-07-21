import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaPaperclip, FaArrowUp, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Welcome = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/inventory/upload-sales/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get("accessToken")}`
        }
      });
      toast.success(response.data.message);
      setFile(null);
      fileInputRef.current.value = ''; // Reset the file input value
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      setFile(null);
      fileInputRef.current.value = ''; 
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <div className="bg-white text-blue-800 p-6 rounded-lg shadow-lg mb-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Welcome to SalesSage!</h1>
        <p className="text-gray-600">
          Ready to predict your sales? Upload your file below to get started.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Upload Sales Data</h2>
        
        <div className="mb-4">
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <input
              type="file"
              accept=".csv, .xlsx, .xls, .xlsm"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button 
              onClick={handleAttachClick}
              className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <FaPaperclip className="text-xl mr-2" />
              <span>Attach File</span>
            </button>
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaArrowUp className="mr-2" />
              <span>Predict Sales</span>
            </button>
          </div>
        </div>

        {file && (
          <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">
                  {file.name.split('.').pop().toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {file.name}
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                fileInputRef.current.value = ''; // Reset the file input value
              }}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
