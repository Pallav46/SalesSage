import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewChat from "./pages/NewChat";
import Me from "./pages/Me";
import SalesReport from "./components/report/SalesReport";
import SalesTable from "./components/report/SalesTable";
import MyReport from "./pages/MyReport";

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChatHistory = lazy(() => import('./pages/ChatHistory'));

function App() {
  
  return (
    <ThemeProvider>
      <Router>
        <div className="">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/myreport" element={<MyReport />} />
              <Route path="/chat/new" element={<NewChat />} />
              <Route path="/chat/:id" element={<ChatHistory />} />
              <Route path="/me" element={<Me />} />
            </Routes>
          </Suspense>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
