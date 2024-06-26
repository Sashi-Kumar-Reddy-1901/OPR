import React, { useRef, useState } from "react";
import axiosInstance from "../../api/axios";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./ResetPassword.css";
import { Zoom, Tooltip } from "@mui/material";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";

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
      const LOGIN_URL = `/users/reset-password?password=${encodeURIComponent(
        password
      )}`;
      try {
        const response = await axiosInstance.post(LOGIN_URL, {});
        console.log(response?.data?.data?.messageCode);
        if (response?.data?.data?.messageCode === 110501) {
          onResetPasswordClose(response?.data?.data?.message);
        } else if (response?.data?.data?.messageCode === 110502) {
          setErrorMessage(response?.data?.data?.message);
        } else if (response?.data?.data?.messageCode === 110503) {
          setErrorMessage(response?.data?.data?.message);
        } else if (response?.data?.data?.messageCode === 110506) {
          setErrorMessage(response?.data?.data?.message);
        } else if (response?.data?.data?.messageCode === 110507) {
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
                  className="w-full p-2 rounded-full font-medium bg-gray-100 border border-gray-500 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  placeholder="Enter Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px" }}>
                        The password must be 8-15 characters long and include at
                        least one number, one lowercase letter, one uppercase
                        letter, and one special character from !@#$%^&*().
                      </span>
                    }
                    placement="right"
                    arrow
                    TransitionComponent={Zoom}
                  >
                    <InfoSharpIcon
                      style={{
                        position: "absolute",
                        right: "-30px",
                        top: "1.4rem",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
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
                  className={`w-full p-2 rounded-full font-medium bg-gray-100 border ${
                    passwordsMatch ? "border-gray-500" : "border-red-500"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  placeholder="Enter Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
              className="mt-8 bg-black text-gray-100 w-full py-2 rounded-full hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
