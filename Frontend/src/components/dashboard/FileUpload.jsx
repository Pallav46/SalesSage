// FileUpload.js

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaPaperclip, FaArrowUp, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/inventory/upload-sales-file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get("accessToken")}`
        }
      });
      toast.success(response.data.message);
      setFile(null);
      fileInputRef.current.value = '';
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      setFile(null);
      fileInputRef.current.value = '';
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
          <input
            type="file"
            accept=".csv, .xlsx, .xls, .xlsm"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button 
            onClick={handleAttachClick}
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
          >
            <FaPaperclip className="text-xl mr-2" />
            <span className="font-medium">Attach File</span>
          </button>
          <button
            onClick={handleUpload}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <FaArrowUp className="mr-2" />
            <span className="font-medium">{loading ? 'Uploading...' : 'Upload'}</span>
          </button>
        </div>
      </div>

      {file && (
        <div className=" p-4 rounded-lg borde flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
              <span className="text-blue-500 font-semibold">
                {file.name.split('.').pop().toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-700 truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
          <button
            onClick={() => {
              setFile(null);
              fileInputRef.current.value = '';
            }}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-opacity-50 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
