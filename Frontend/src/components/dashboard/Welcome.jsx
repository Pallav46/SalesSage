import React from 'react';
import FileUpload from './FileUpload'; // Adjust the import path as needed

const Welcome = () => {
  const handleUploadSuccess = (data) => {
    // Handle success logic here
    console.log('Upload successful:', data);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <div className="bg-white text-blue-800 p-6 rounded-lg shadow-lg mb-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Welcome to SalesSage!</h1>
        <p className="text-gray-600">
          Ready to predict your sales? Upload your file below to get started.
        </p>
      </div>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
    </div>
  );
};

export default Welcome;
