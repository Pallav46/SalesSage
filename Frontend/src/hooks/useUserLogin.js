import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { startTokenRefresh } from "../../api/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const useUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const login = async ({ company_id, password }) => {
    setLoading(true);
    setStatusCode(null);

    try {
      const response = await fetch("http://localhost:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_id, password }),
      });
      
      const data = await response.json();
      setStatusCode(response.status);

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Context
        setAuthUser(data.user);

        // Store tokens in cookies with expiration
        Cookies.set("accessToken", data.access_token);
        Cookies.set("refreshToken", data.refresh_token);

        toast.success("Login Successful");
        startTokenRefresh();
        navigate("/dashboard");
      }
      
      // We're not handling errors here anymore, just returning the status code
      
    } catch (error) {
      console.error("Login error:", error);
      setStatusCode(500); // Assume a 500 error for network issues
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, statusCode };
};

export default useUserLogin;