// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext'; // Adjust path if necessary
import { toast } from 'react-toastify';

const PrivateRoute = ({ element, ...rest }) => {
  const { userData, loading } = useAuth();
    console.log(userData);
  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  if (!userData) {
    toast.error('You need to be logged in to access this page.');
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
