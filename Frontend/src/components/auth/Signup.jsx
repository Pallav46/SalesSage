import { useState, useRef, useEffect } from "react";
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
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleNext = () => {
    if (step === 1) {
      axios
        .post("http://127.0.0.1:8000/accounts/send-otp/", { email })
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
        } else {
          console.error("OTP verification failed", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP", error);
      });
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/accounts/register/", {
        email,
        company_name: name,
        company_id: username,
        password
      })
      .then((response) => {
        if (response.status === 201) {
          console.log(response.data.message);
        } else {
          console.error("Register failed", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error registering", error);
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
    // Handle resend OTP logic here
    axios
      .post("http://127.0.0.1:8000/accounts/send-otp/", { email })
      .then(() => {
        startTimer();
      })
      .catch((error) => {
        console.error("Error resending OTP", error);
      });
  };

  const checkUsernameAvailability = (username) => {
    axios
      .post(`http://127.0.0.1:8000/accounts/is-companyID-available/`, {
        company_id: username,
      })
      .then((response) => {
        if (response.status === 200 && response.data.message === 'Company_id is available') {
          setUsernameAvailable(true);
        } else {
          setUsernameAvailable(false);
        }
      })
      .catch((error) => {
        console.error("Error checking username availability", error);
        setUsernameAvailable(false);
      });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
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
      className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? "dark" : ""}`}
    >
      <div
        className={`w-full max-w-sm ${isDarkMode ? "dark" : ""}`}
      >
        <form
          className={classNames(
            "bg-[#020024]-400 dark:bg-gray-800 shadow-md rounded-3xl px-8 pt-8 pb-10 mb-4 relative border-4 border-white backdrop-blur-sm",
            { "dark": isDarkMode }
          )}
        >
          <button
            type="button"
            onClick={onClose}
            className={classNames(
              "absolute top-2 right-2 text-white-500 dark:text-gray-300 hover:text-blue-700 dark:hover:text-gray-100",
              { "dark": isDarkMode }
            )}
          >
            <FaTimes size={20} />
          </button>
          <h2
            className={classNames("text-2xl font-bold mb-6 text-center", {
              "text-white": isDarkMode,
              "text-gray-800": isDarkMode,
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
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      ref={(el) => (otpRefs.current[index] = el)}
                      className="w-10 h-10 text-center border-2 rounded-lg dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    />
                  ))}
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out mt-4"
                  type="button"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
                {resendEnabled ? (
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out mt-4"
                    type="button"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-gray-600 mt-4">
                    Resend OTP in {timer} seconds
                  </p>
                )}
              </div>
            )}
            {step === 3 && (
              <div>
                <label
                  className={classNames("block text-sm font-bold mb-2", {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300": isDarkMode,
                  })}
                  htmlFor="name"
                >
                  Company Name
                </label>
                <input
                  className={classNames(
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                    {
                      "text-gray-700": !isDarkMode,
                      "text-gray-300 dark:bg-gray-600": isDarkMode,
                    }
                  )}
                  id="name"
                  type="text"
                  placeholder="Company Name"
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
                  Phone Number
                </label>
                <input
                  className={classNames(
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                    {
                      "text-gray-700": !isDarkMode,
                      "text-gray-300 dark:bg-gray-600": isDarkMode,
                    }
                  )}
                  id="phone"
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label
                  className={classNames("block text-sm font-bold mb-2 mt-4", {
                    "text-gray-700": !isDarkMode,
                    "text-gray-300": isDarkMode,
                  })}
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className={classNames(
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                    {
                      "text-gray-700": !isDarkMode,
                      "text-gray-300 dark:bg-gray-600": isDarkMode,
                    }
                  )}
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
                {usernameAvailable === false && (
                  <p className="text-red-600">Username is already taken.</p>
                )}
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
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
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
                    "shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
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
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out mt-4"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              >
                Back
              </button>
            )}
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
