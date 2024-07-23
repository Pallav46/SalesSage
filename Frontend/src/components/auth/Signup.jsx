import { useState, useRef, useEffect } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import classNames from "classnames";
import { useTheme } from "../../ThemeContext";
import axios from "axios";
import Cookies from "js-cookie";
import { startTokenRefresh } from "../../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Signup = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [companyIdError, setCompanyIdError] = useState("");

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) {
      axios
        .post("http://127.0.0.1:8000/accounts/send-otp/", { email })
        .then(() => {
          startTimer();
          setStep(step + 1);
          setEmailError(""); // Clear previous error
        })
        .catch((error) => {
          setEmailError(error.response.data.error);
        });
    } else {
      setStep(step + 1);
    }
  };

  const verifyOtp = () => {
    const otpCode = otp.join("");
    axios
      .post("http://127.0.0.1:8000/accounts/verify-otp/", {
        email,
        otp: otpCode,
      })
      .then((response) => {
        if (response.status === 201) {
          setStep(step + 1);
          setOtpError(""); // Clear previous error
        } else {
          setOtpError(response.data.message);
        }
      })
      .catch((error) => {
        setOtpError("Error verifying OTP");
      });
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/accounts/register/", {
        email,
        company_name: companyName,
        company_id: companyId,
        password,
      })
      .then((response) => {
        if (response.status === 201) {
          console.log("Login successful", response.data);

          Cookies.set("accessToken", response.data.access_token, { secure: true, sameSite: 'Strict' });
          Cookies.set("refreshToken", response.data.refresh_token, { secure: true, sameSite: 'Strict' });

          // Start the token refresh interval
          startTokenRefresh();

          // Navigate to the dashboard
          navigate("/dashboard");
          toast.success("SignUp Successfully")
          onClose(); // Close the login modal
        } else {
            setRegisterError("Incorrect Credientials");
         
        }
      })
      .catch((error) => {
        setRegisterError("Error registering");
      });
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
    axios
      .post("http://127.0.0.1:8000/accounts/send-otp/", { email })
      .then(() => {
        startTimer();
      })
      .catch((error) => {
        setOtpError("Error resending OTP");
      });
  };

  const checkUsernameAvailability = (companyId) => {
    axios
      .get(`http://127.0.0.1:8000/accounts/id-available?company_id=${companyId}`)
      .then((response) => {
        if (response.status === 200 && response.data.available) {
          setUsernameAvailable(true);
          setCompanyIdError(""); // Clear previous error
        } else {
          setUsernameAvailable(false);
          setCompanyIdError(response.data.message);
        }
      })
      .catch((error) => {
        setUsernameAvailable(false);
        setCompanyIdError("Error checking company ID availability");
      });
  };

  const handleCompanyIdChange = (e) => {
    setCompanyId(e.target.value);
    setUsernameAvailable(null); // Trigger spinner
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      checkUsernameAvailability(e.target.value);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className={`w-full max-w-sm ${isDarkMode ? "dark" : ""}`}>
        <form
          className={classNames(
            "bg-[#020024]-400 dark:bg-gray-800 shadow-md rounded-3xl px-8 pt-8 pb-10 mb-4 relative border-4 border-white backdrop-blur-sm",
            { dark: isDarkMode }
          )}
        >
          <button
            type="button"
            onClick={onClose}
            className={classNames(
              "absolute top-2 right-2 text-white-500 dark:text-gray-300 hover:text-blue-700 dark:hover:text-gray-100",
              { dark: isDarkMode }
            )}
          >
            <FaTimes size={20} />
          </button>
          <h2
            className={classNames("text-2xl font-bold mb-6 text-center", {
              "text-white": isDarkMode,
              "text-gray-800": !isDarkMode,
            })}
          >
            Sign Up
          </h2>
          <div className="mb-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-color-300 bg-blue-200">
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
                <input
                  className={classNames(
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                    {
                      "text-gray-700": !isDarkMode,
                      "text-gray-300 dark:bg-gray-600": isDarkMode,
                    }
                  )}
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-2">{emailError}</p>
                )}
                <button
                  className="bg-color-300 hover:bg-white hover:text-color-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out mt-4"
                  type="button"
                  onClick={handleNext}
                >
                  Verify Email
                </button>
              </div>
            )}
            {step === 2 && (
              <div>
                <div className="flex justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className={classNames(
                        "w-10 h-10 m-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
                        {
                          "text-gray-700": !isDarkMode,
                          "text-gray-300 dark:bg-gray-600": isDarkMode,
                        }
                      )}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-xs mt-2">{otpError}</p>
                )}
                <div className="flex justify-between">
                  <button
                    className="bg-color-300 hover:bg-white hover:text-color-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    type="button"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                  <button
                    className="bg-color-300 hover:bg-white hover:text-color-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    type="button"
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
                <div className="flex justify-center items-center mt-4">
                  <p className="text-sm">
                    Resend OTP in{" "}
                    <span className="font-semibold">{timer}</span> seconds
                  </p>
                </div>
                {resendEnabled && (
                  <div className="flex justify-center">
                    <button
                      className="text-sm text-blue-500 hover:underline"
                      onClick={handleResendOtp}
                      disabled={!resendEnabled}
                    >
                      Resend OTP
                    </button>
                  </div>
                )}
              </div>
            )}
            {step === 3 && (
              <div>
                <input
                  className={classNames(
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4",
                    {
                      "text-gray-700": !isDarkMode,
                      "text-gray-300 dark:bg-gray-600": isDarkMode,
                    }
                  )}
                  id="companyName"
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className="relative">
                  <input
                    className={classNames(
                      "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4",
                      {
                        "text-gray-700": !isDarkMode,
                        "text-gray-300 dark:bg-gray-600": isDarkMode,
                      }
                    )}
                    id="companyId"
                    type="text"
                    placeholder="Company ID"
                    value={companyId}
                    onChange={handleCompanyIdChange}
                  />
                  {usernameAvailable === null && (
                    <FaSpinner
                      className="absolute right-3 top-3 text-gray-500 animate-spin"
                      size={20}
                    />
                  )}
                  {usernameAvailable === true && (
                    <FaCheckCircle
                      className="absolute right-3 top-3 text-green-500"
                      size={20}
                    />
                  )}
                  {usernameAvailable === false && (
                    <FaTimesCircle
                      className="absolute right-3 top-3 text-red-500"
                      size={20}
                    />
                  )}
                </div>
                {companyIdError && (
                  <p className="text-red-500 text-xs mt-2">{companyIdError}</p>
                )}
                <input
                  className={classNames(
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4",
                    {
                      "text-gray-700": !isDarkMode,
                      "text-gray-300 dark:bg-gray-600": isDarkMode,
                    }
                  )}
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  className={classNames(
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4",
                    {
                      "text-gray-700": !isDarkMode,
                      "text-gray-300 dark:bg-gray-600": isDarkMode,
                    }
                  )}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {registerError && (
                  <p className="text-red-500 text-xs mt-2">{registerError}</p>
                )}
                <div className="flex justify-between">
                  <button
                    className="bg-color-300 hover:bg-white hover:text-color-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    type="button"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                  <button
                    className="bg-color-300 hover:bg-white hover:text-color-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
