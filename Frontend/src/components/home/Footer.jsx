import React from 'react';

const Footer = () => (
  <footer className="footer bg-gray-800 text-white py-8">
    <div className="container mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} SalesAge. All rights reserved.</p>
      <p className="mt-4">Contact us: support@salesage.com</p>
      <div className="mt-4">
        <a href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</a> | <a href="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default Footer;
