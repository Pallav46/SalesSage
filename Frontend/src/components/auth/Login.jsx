import React, { useState } from "react";
import { useTheme } from "../../ThemeContext";
import { FaTimes } from "react-icons/fa";
import Signup from "./Signup";
import axios from "axios";
import Cookies from "js-cookie";
import { startTokenRefresh } from "../../../api/api";
const Login = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState("");

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
    if (username && password && !passwordError) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/accounts/login/", {
          company_id: username,
          password,
          // remember_me: rememberMe,
        });
  
        if (response.status === 200) {
          console.log("Login successful", response.data);
  
          Cookies.set("accessToken", response.data.access_token, { secure: true, sameSite: 'Strict' });
          Cookies.set("refreshToken", response.data.refresh_token, { secure: true, sameSite: 'Strict' });
  
          // Start the token refresh interval
          startTokenRefresh();
  
          // Handle successful login (e.g., redirect)
          onClose(); // Close the login modal
        } else {
          setLoginError("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error", error);
        setLoginError("An error occurred during login. Please try again.");
      }
    } else {
      setLoginError("Please fill in all fields correctly.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? "dark" : ""}`}
    >
      <div
        className={`w-full max-w-sm z-50 ${isDarkMode ? "dark" : ""}`}
      >
        {showSignup ? (
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
              onClick={onClose} // Close the modal when the cross button is clicked
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
            >
              Sign In
            </button>
            <br />
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
