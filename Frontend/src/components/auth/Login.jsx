import { useState } from "react";
import { useTheme } from "../../ThemeContext";
import { FaTimes } from "react-icons/fa";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { startTokenRefresh} from "../../../api/api";
import Cookies from "js-cookie";

const Login = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(
      value.length < 8 ? "Password must be at least 8 characters long" : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); // Reset error state before attempting login
  
    if (username && password && !passwordError) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/accounts/login/", {
          company_id: username,
          password
        });

        // If the request is successful (status code 2xx)
        const data = response.data;
        
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Context
        setAuthUser(data.user);

        // Store tokens in cookies with expiration
        Cookies.set("accessToken", data.access_token);
        Cookies.set("refreshToken", data.refresh_token);

        startTokenRefresh();
        navigate("/dashboard");
      } catch (error) {
        console.error("Login error", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 401) {
            setLoginError("Incorrect username or password.");
          } else {
            setLoginError("An error occurred. Please try again.");
          }
        } else if (error.request) {
          // The request was made but no response was received
          setLoginError("No response from server. Please try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setLoginError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoginError("Please fill in all fields correctly.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? "dark" : ""}`}
    >
      <div className={`w-full max-w-sm z-50 ${isDarkMode ? "dark" : ""}`}>
        {showForgotPassword ? (
          <ForgotPassword onClose={() => setShowForgotPassword(false)} />
        ) : showSignup ? (
          <Signup onClose={() => setShowSignup(false)} />
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`bg-[#020024]-400 dark:bg-gray-800 shadow-md rounded-3xl px-8 pt-8 pb-10 mb-4 relative border-4 border-white backdrop-blur-lg ${
              isDarkMode ? "dark" : ""
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2 right-2 text-white-500 dark:text-gray-300 hover:text-blue-700 dark:hover:text-gray-100"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-white-400 dark:text-white">
              Login
            </h2>
            {loginError && (
              <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>
            )}
            <div className="mb-4">
              <div className="relative">
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="relative">
                <input
                  className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordError ? "border-red-500" : ""
                  }`}
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
              )}
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-white-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <p className="text-sm text-center text-white-400 dark:text-gray-300 mt-4">
              New here?{" "}
              <a
                href="#"
                className="font-bold text-blue-500 hover:text-blue-800 transition duration-300 ease-in-out"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignup(true);
                }}
              >
                Register
              </a>
            </p>
            <p className="text-sm text-center text-white-400 dark:text-gray-300 mt-4">
              Forgot Password?{" "}
              <a
                href="#"
                className="font-bold text-blue-500 hover:text-blue-800 transition duration-300 ease-in-out"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }}
              >
                Click here
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
