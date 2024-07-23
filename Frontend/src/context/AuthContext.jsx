// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({
    companyId: null,
    userData: null,
    loading: true,
    error: null
  });

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get("http://localhost:8000/accounts/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;
      const newAuthUser = {
        companyId: userData.company_id,
        userData: userData,
        loading: false,
        error: null
      };

      setAuthUser(newAuthUser);
    } catch (error) {
      setAuthUser(prevState => ({
        ...prevState,
        error: error,
        loading: false
      }));
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
