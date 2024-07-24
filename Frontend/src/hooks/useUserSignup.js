import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { startTokenRefresh } from "../../api/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const useUserSignup = () => {
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null); // State for status code
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const signup = async ({ email, name, company_id, password }) => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, company_id, password }),
      });
      const data = await response.json();
      setStatusCode(response.status); // Set the status code

      if (!response.ok) {
        throw new Error(data.error || "signup failed");
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // context
      setAuthUser(data.user)

      // Store tokens in cookies with expiration
      Cookies.set("accessToken", data.access_token);
      Cookies.set("refreshToken", data.refresh_token);

      toast.success("signup Successful");
      startTokenRefresh();
      navigate("/dashboard");
    } catch (error) {
      console.error("signup error:", error);
      toast.error(error.message || "signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, statusCode };
};

export default useUserSignup;
