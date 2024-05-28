import React, { useRef, useState } from "react";
import axios from "../../api/axios";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./ResetPassword.css";

const ResetPassword = ({ onResetPasswordClose }) => {
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleButtonClick = async () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setErrorMessage("Passwords do not match");
      return;
    } else {
      setPasswordsMatch(true);
      setErrorMessage("");
      const token = sessionStorage.getItem("token");
      const LOGIN_URL = `/users/reset-password?password=${encodeURIComponent(
        password
      )}`;
      try {
        const response = await axios.post(
          LOGIN_URL,
          {}, // Ensuring JSON body
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response?.data?.data?.messageCode);
        if (response?.data?.data?.messageCode === 110501) {
          onResetPasswordClose(response?.data?.data?.message);
        } else if (response?.data?.data?.messageCode === 110502) {
          setErrorMessage(response?.data?.data?.message);
        } else if (response?.data?.data?.messageCode === 110503) {
          setErrorMessage(response?.data?.data?.message);
        }
        else if (response?.data?.data?.messageCode === 110506) {
          setErrorMessage(response?.data?.data?.message);
        }
        else if (response?.data?.data?.messageCode === 110507) {
          setErrorMessage(response?.data?.data?.message);
        }
      } catch (error) {
        setErrorMessage("An error occurred while resetting the password");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex-1">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mx-auto max-w-xs">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">
                New Password *
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white placeholder-gray-500"
                  placeholder="Enter Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  ref={confirmPasswordRef}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`border ${
                    passwordsMatch ? "border-grey-300" : "border-red-500"
                  } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white placeholder-gray-500`}
                  placeholder="Enter Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>
            </div>

            {errorMessage && (
                <p className="text-red-500 text-xs text-center max-h-0">
                  {errorMessage}
                </p>
            )}

            <button
              onClick={handleButtonClick}
              className="mt-8 bg-black text-gray-100 w-full py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
