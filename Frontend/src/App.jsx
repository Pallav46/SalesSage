import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from "./context/AuthContext";

// Import components with lazy loading
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
// const ChatHistory = lazy(() => import('./pages/ChatHistory'));
// const NewChat = lazy(() => import('./pages/NewChat'));
const Me = lazy(() => import('./pages/Me'));
const SalesReport = lazy(() => import('./components/report/SalesReport'));
const SalesTable = lazy(() => import('./components/report/SalesTable'));
const MyReport = lazy(() => import('./pages/MyReport'));

function AppRoutes() {
  const { authUser } = useAuthContext();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/dashboard" 
        element={authUser ? <Dashboard company_id={authUser.company_id}/> : <Navigate to="/" />} 
      />
     
      <Route 
        path="/me" 
        element={authUser ? <Me /> : <Navigate to="/" />} 
      />
      <Route 
        path="/salesreport" 
        element={authUser ? <SalesReport /> : <Navigate to="/" />} 
      />
      <Route 
        path="/salestable" 
        element={authUser ? <SalesTable /> : <Navigate to="/" />} 
      />
      <Route 
        path="/myreport" 
        element={authUser ? <MyReport /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
          </Suspense>
      </ThemeProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;
