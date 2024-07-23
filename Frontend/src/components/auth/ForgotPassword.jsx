import { useState, useRef, useEffect } from "react";
import { FaTimes, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import classNames from "classnames";
import { useTheme } from "../../ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleNext = () => {
    if (step === 1) {
      axios
        .post("http://127.0.0.1:8000/accounts/forget-password/", { email })
        .then(() => {
          startTimer();
          setStep(step + 1);
          setEmailError(""); // Clear previous error
        })
        .catch((error) => {
          const responseError = error.response?.data?.error;
          if (responseError) {
            setEmailError(responseError);
          } else {
            setEmailError("An unexpected error occurred.");
          }
        });
    } else {
      setStep(step + 1);
    }
  };

  const verifyOtp = () => {
    const otpCode = otp.join("");
    axios
      .post("http://127.0.0.1:8000/accounts/forget-password-otp/", { email, otp: otpCode })
      .then((response) => {
        if (response.status === 200) {
          setStep(step + 1);
          setOtpError(""); // Clear previous error
        } else {
          setOtpError(response.data.message);
        }
      })
      .catch((error) => {
        const responseError = error.response?.data?.error;
        if (responseError) {
          setOtpError(responseError);
        } else {
          setOtpError("An unexpected error occurred.");
        }
      });
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    axios
      .patch("http://127.0.0.1:8000/accounts/forget-password/", { email, new_password: password })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          setPasswordError(""); // Clear previous error
        } else {
          setPasswordError(response.data.error);
        }
      })
      .catch((error) => {
        const responseError = error.response?.data?.error;
        if (responseError) {
          setPasswordError(responseError);
        } else {
          setPasswordError("An unexpected error occurred.");
        }
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
      .post("http://127.0.0.1:8000/accounts/forget-password/", { email })
      .then(() => {
        startTimer();
      })
      .catch((error) => {
        setOtpError("Error resending OTP");
      });
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? "dark" : ""}`}>
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
            Forgot Password
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
                  Send OTP
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
                  <button
                    className="text-blue-500 text-sm mt-2 focus:outline-none"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
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
                  id="password"
                  type="password"
                  placeholder="New Password"
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
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-2">{passwordError}</p>
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
                    Change Password
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

export default ForgotPassword;
