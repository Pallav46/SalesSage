import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#020024] via-[#090979] to-[#00D4FF] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <ul>
              <li className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2" /> IIIT Guwahati, India
              </li>
              <li className="flex items-center mb-2">
                <FaEnvelope className="mr-2" />
                <a href="mailto:pallavkumar81021@gmail.com" className="hover:text-blue-500">pallavkumar81021@gmail.com</a>
              </li>
              <li className="flex items-center mb-2">
                <FaPhone className="mr-2" />
                <a href="tel:+6200845646" className="hover:text-blue-500">+91 62008 45646</a>
              </li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2"><Link to="/" className="hover:text-blue-500">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="hover:text-blue-500">About</Link></li>
              <li className="mb-2"><Link to="/services" className="hover:text-blue-500">Services</Link></li>
              <li className="mb-2"><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/Pallav46" target="_blank" rel="noopener noreferrer">
                <FaGithub size={24} className="text-white hover:text-blue-600 transition duration-300 ease-in-out" />
              </a>
              <a href="https://www.linkedin.com/in/pallav-kumar-45436a1a2/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} className="text-white hover:text-blue-600 transition duration-300 ease-in-out" />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} SalesSage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
