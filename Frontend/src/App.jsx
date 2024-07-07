import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
