import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-10 bg-gradient-to-r from-[#020024] to-[#090979]">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <a href="#" className="text-3xl font-bold">SalesSage</a>
          <div className="hidden md:flex space-x-4">
            <a href="#features" className="hover:text-[#00D4FF] transition duration-300">Features</a>
            <a href="#how-it-works" className="hover:text-[#00D4FF] transition duration-300">How It Works</a>
            <a href="#pricing" className="hover:text-[#00D4FF] transition duration-300">Pricing</a>
            <a href="#team" className="hover:text-[#00D4FF] transition duration-300">Team</a>
            <a href="#contact" className="hover:text-[#00D4FF] transition duration-300">Contact</a>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <a href="#features" className="block py-2 hover:text-[#00D4FF] transition duration-300">Features</a>
            <a href="#how-it-works" className="block py-2 hover:text-[#00D4FF] transition duration-300">How It Works</a>
            <a href="#pricing" className="block py-2 hover:text-[#00D4FF] transition duration-300">Pricing</a>
            <a href="#team" className="block py-2 hover:text-[#00D4FF] transition duration-300">Team</a>
            <a href="#contact" className="block py-2 hover:text-[#00D4FF] transition duration-300">Contact</a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;