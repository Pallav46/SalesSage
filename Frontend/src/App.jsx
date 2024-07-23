import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from "./context/AuthContext";

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
  const { authUser } = useAuth();

  if (authUser.loading) {
    // Show a loading state while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/dashboard" 
        element={authUser.companyId ? <Dashboard /> : <Navigate to="/" />} 
      />
     
      <Route 
        path="/me" 
        element={authUser.companyId ? <Me /> : <Navigate to="/" />} 
      />
      <Route 
        path="/salesreport" 
        element={authUser.companyId ? <SalesReport /> : <Navigate to="/" />} 
      />
      <Route 
        path="/salestable" 
        element={authUser.companyId ? <SalesTable /> : <Navigate to="/" />} 
      />
      <Route 
        path="/myreport" 
        element={authUser.companyId ? <MyReport /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;
