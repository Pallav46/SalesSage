import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import classNames from "classnames";
import { useTheme } from "../../ThemeContext";
import axios from "axios";

const Signup = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Ensure only the last digit is taken
    setOtp(newOtp);

    // Move to next input box if a digit is entered
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleNext = () => {
    if (step === 1) {
      axios.post('http://127.0.0.1:8000/accounts/send-otp/', { email })
        .then(() => {
          startTimer();
          setStep(step + 1);
        })
        .catch((error) => {
          console.error("Error sending OTP", error);
        });
    } else {
      setStep(step + 1);
    }
  };


  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle final form submission logic here
  };

  const startTimer = () => {
    setTimer(30);
    setResendEnabled(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = () => {
    startTimer();
    // Handle resend OTP logic here
  };

  const checkUsernameAvailability = (username) => {
    axios
      .get(`/api/check-username?username=${username}`)
      .then((response) => {
        setUsernameAvailable(response.data.available);
      })
      .catch((error) => {
        console.error("Error checking username availability", error);
      });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      checkUsernameAvailability(e.target.value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`w-full max-w-md ${isDarkMode ? "dark" : ""}`}>
      <form
        className={classNames(
          "bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 relative",
          { "dark:bg-gray-800": isDarkMode }
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className={classNames(
            "absolute top-2 right-2 text-gray-500 hover:text-gray-700",
            { "dark:text-gray-300 dark:hover:text-gray-100": isDarkMode }
          )}
        >
          <FaTimes size={20} />
        </button>
        <h2
          className={classNames("text-2xl font-bold mb-6 text-center", {
            "text-gray-800": !isDarkMode,
            "text-white": isDarkMode,
          })}
        >
          Sign Up
        </h2>
        <div className="mb-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  Step {step} of 3
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${(step / 3) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
          {step === 1 && (
            <div>
              <label
                className={classNames("block text-sm font-bold mb-2", {
                  "text-gray-700": !isDarkMode,
                  "text-gray-300": isDarkMode,
                })}
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={classNames(
                  "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300 dark:bg-gray-700": isDarkMode,
                  }
                )}
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleNext}
              >
                Verify Email
              </button>
              {resendEnabled ? (
                <button
                  className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              ) : (
                <p className="mt-4 text-gray-600">
                  Resend OTP in {timer} seconds
                </p>
              )}
            </div>
          )}
          {step === 2 && (
            <div>
              <label
                className={classNames("block text-sm font-bold mb-2", {
                  "text-gray-700": !isDarkMode,
                  "text-gray-300": isDarkMode,
                })}
                htmlFor="otp"
              >
                OTP
              </label>
              <div className="flex justify-between mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className={classNames(
                      "shadow appearance-none border rounded w-full py-2 px-3 text-center leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1",
                      {
                        "text-gray-700": !isDarkMode,
                        "text-gray-300 dark:bg-gray-700": isDarkMode,
                      }
                    )}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handlePrevious}
                >
                  Back
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleNext}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <label
                className={classNames("block text-sm font-bold mb-2", {
                  "text-gray-700": !isDarkMode,
                  "text-gray-300": isDarkMode,
                })}
                htmlFor="username"
              >
                Username
              </label>
              <input
                className={classNames(
                  "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300 dark:bg-gray-700": isDarkMode,
                  }
                )}
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
              {username && (
                <p
                  className={classNames("mt-2", {
                    "text-red-500": usernameAvailable === false,
                    "text-green-500": usernameAvailable === true,
                    "text-gray-600": usernameAvailable === null,
                  })}
                >
                  {usernameAvailable === true
                    ? "Username is available"
                    : usernameAvailable === false
                    ? "Username is taken"
                    : "Checking username availability..."}
                </p>
              )}
              <label
                className={classNames("block text-sm font-bold mb-2 mt-4", {
                  "text-gray-700": !isDarkMode,
                  "text-gray-300": isDarkMode,
                })}
                htmlFor="name"
              >
                Name
              </label>
              <input
                className={classNames(
                  "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300 dark:bg-gray-700": isDarkMode,
                  }
                )}
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label
                className={classNames("block text-sm font-bold mb-2 mt-4", {
                  "text-gray-700": !isDarkMode,
                  "text-gray-300": isDarkMode,
                })}
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                className={classNames(
                  "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300 dark:bg-gray-700": isDarkMode,
                  }
                )}
                id="phone"
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label
                className={classNames("block text-sm font-bold mb-2 mt-4", {
                  "text-gray-700": !isDarkMode,
                  "text-gray-300": isDarkMode,
                })}
                htmlFor="password"
              >
                Password
              </label>
              <input
                className={classNames(
                  "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300 dark:bg-gray-700": isDarkMode,
                  }
                )}
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                className={classNames("block text-sm font-bold mb-2 mt-4", {
                  "text-gray-700": !isDarkMode,
                  "text-gray-300": isDarkMode,
                })}
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className={classNames(
                  "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300 dark:bg-gray-700": isDarkMode,
                  }
                )}
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handlePrevious}
                >
                  Back
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Signup;

