import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "./auth/Login";
import { useTheme } from '../ThemeContext';
import { Link as ScrollLink } from 'react-scroll';  // Import react-scroll

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <>
      <nav className="bg-gray-800 dark:bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/" smooth={true} duration={500}>Home</NavLink>
                  <ScrollLink
                    to="about"
                    smooth={true}
                    duration={500}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    About
                  </ScrollLink>
                  <Link to="/services" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Services</Link>
                  <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Contact</Link>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Login
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-700 dark:bg-gray-600"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                Home
              </Link>
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                About
              </ScrollLink>
              <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Services</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Contact</Link>
              <button
                onClick={() => setShowLogin(true)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                Login
              </button>
              <button
                onClick={toggleDarkMode}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Login Popover */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
            <Login onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
};

const NavLink = ({ to, children, smooth, duration, mobile }) => (
  <ScrollLink
    to={to}
    smooth={smooth}
    duration={duration}
    className={`${
      mobile
        ? "block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
        : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
    }`}
  >
    {children}
  </ScrollLink>
);

export default Navbar;
