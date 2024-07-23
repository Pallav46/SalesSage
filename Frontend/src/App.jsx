import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components with lazy loading
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChatHistory = lazy(() => import('./pages/ChatHistory'));
const NewChat = lazy(() => import('./pages/NewChat'));
const Me = lazy(() => import('./pages/Me'));
const SalesReport = lazy(() => import('./components/report/SalesReport'));
const SalesTable = lazy(() => import('./components/report/SalesTable'));
const MyReport = lazy(() => import('./pages/MyReport'));

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chathistory" element={<ChatHistory />} />
            <Route path="/newchat" element={<NewChat />} />
            <Route path="/me" element={<Me />} />
            <Route path="/salesreport" element={<SalesReport />} />
            <Route path="/salestable" element={<SalesTable />} />
            <Route path="/myreport" element={<MyReport />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;
