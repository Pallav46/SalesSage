import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startTokenRefresh } from '../api/api'; // Import the function

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  useEffect(() => {
    // Start refreshing tokens periodically when the app loads
    startTokenRefresh();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
