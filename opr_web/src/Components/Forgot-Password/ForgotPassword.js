import React, { useState, useRef } from "react";
import axiosInstance from "../../api/axios";

const ForgotPassword = ({ onForgotPasswordClose, onOpenOtp }) => {
  const emailRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleButtonClick = async () => {
    console.log(emailRef.current.value);
    const email = emailRef.current.value;
    const forgotPasswordUrl = `/users/forgot-password?email=${encodeURIComponent(
      email
    )}`;
    try {
      const response = await axiosInstance.post(forgotPasswordUrl, {});
      console.log(JSON.stringify(response?.data));
      console.log(response?.data?.data?.messageCode);
      if (
        response?.data?.data?.messageCode === 110201 ||
        response?.data?.data?.messageCode === 110203
      ) {
        onForgotPasswordClose(response?.data?.data?.message);
        onOpenOtp(email);
      } else {
        setErrorMessage(response?.data?.data?.message);
      }
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      console.log(accessToken);
      console.log(roles);
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex-1">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mx-auto max-w-xs">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">
                  Email Id*
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  className="w-full p-2 rounded-full font-medium bg-gray-100 border border-gray-500 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                   placeholder="Enter Email Id"
                />
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
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
