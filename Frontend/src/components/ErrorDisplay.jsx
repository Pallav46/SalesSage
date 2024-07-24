// components/ErrorDisplay.js
import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#020024] text-[#00D4FF]">
      <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
      <p className="text-xl mb-8">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-[#00D4FF] text-[#020024] px-4 py-2 rounded-md hover:bg-[#0099FF] transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorDisplay;