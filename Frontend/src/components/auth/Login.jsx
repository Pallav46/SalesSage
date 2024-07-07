import React, { useState, useCallback } from "react";
import { useTheme } from "../../ThemeContext";
import debounce from "lodash/debounce";
import { FaUser, FaLock, FaCheck, FaTimes } from "react-icons/fa";
import Signup from "./Signup";

const Login = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const validateUsername = useCallback((value) => {
    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
      setIsUsernameValid(false);
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores"
      );
      setIsUsernameValid(false);
    } else {
      setUsernameError("");
      setIsUsernameValid(true);
    }
  }, []);

  const debouncedValidateUsername = useCallback(
    debounce(validateUsername, 300),
    [validateUsername]
  );

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    debouncedValidateUsername(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(
      value.length < 8 ? "Password must be at least 8 characters long" : ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usernameError && !passwordError && username && password) {
      console.log("Login submitted", { username, password, rememberMe });
      // Handle login logic here
    } else {
      console.log("Form has errors or empty fields");
    }
  };

  return (
    <div className={`w-full max-w-md ${isDarkMode ? "dark" : ""}`}>
      {showSignup ? (
        <Signup onClose={() => setShowSignup(false)} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 relative"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Login
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  usernameError ? "border-red-500" : ""
                }`}
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
              {isUsernameValid && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaCheck className="text-green-500" />
                </span>
              )}
            </div>
            {usernameError && (
              <p className="text-red-500 text-xs italic mt-1">{usernameError}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  passwordError ? "border-red-500" : ""
                }`}
                id="password"
                type="password"
                placeholder="******************"
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
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              type="submit"
            >
              Sign In
            </button>
            <a
              href="#"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 transition duration-300 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                setShowSignup(true);
              }}
            >
              Sign Up
            </a>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
