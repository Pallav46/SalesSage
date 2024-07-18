import { useState } from "react";
import Login from "./auth/Login";

const Hero = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-r from-color-300 via-color-400 to-color-500 h-screen flex flex-col text-white overflow-hidden font-montserrat"
    >
      <header className="flex justify-between items-center p-6 w-full">
        <div className="text-4xl font-bold">SalesSage</div>
        <nav>
          <a href="/about" className="ml-4 hover:text-blue-200 font-bold">
            About
          </a>
          <button
            onClick={handleLoginClick}
            className="ml-4 hover:text-blue-200 font-bold bg-transparent border-none cursor-pointer"
          >
            Login
          </button>
        </nav>
      </header>

      <div className="flex-grow flex items-center px-12 relative">
        <div className="z-10 max-w-2xl">
          <h2 className="text-6xl font-bold leading-tight mb-8 text-left">
            Precision Demand
            <br />
            <span className="bg-white text-color-300 pt-0 pb-0 px-2">Forecasting</span>
            For
            <br />
            Inventory
          </h2>
          <button className="bg-white text-color-400 px-6 py-2 rounded-full hover:bg-color-400 hover:text-white transition duration-300 text-left font-semibold">
            Know More
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[50vw] h-[50vw] rounded-full 
                          bg-[url('/bg2.png')] bg-cover bg-center bg-no-repeat
                          transition-transform duration-300 transform hover:scale-105"
          ></div>
        </div>
      </div>

      {/* Conditionally render the Login component */}
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Login onClose={handleCloseLogin} />
        </div>
      )}
    </section>
  );
};

export default Hero;
