
const FileProcessing = () => {
  return (
    <div className="bg-gradient-to-r from-color-300 via-color-400 to-color-500 min-h-screen flex flex-col justify-center items-center text-white">
      <div className="max-w-2xl p-8 bg-gray-900/70 rounded-3xl shadow-lg text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Processing Your Report</h1>
        <p className="text-xl md:text-2xl mb-4">Please wait while we predict your sales report.</p>
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-transparent border-purple-500 rounded-full animate-spin-reverse"></div>
          <div className="absolute inset-4 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg md:text-xl">Your report is being predicted. Thank you for your patience.</p>
      </div>
    </div>
  );
};

export default FileProcessing;