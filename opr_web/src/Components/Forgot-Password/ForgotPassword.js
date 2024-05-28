import React, { useState, useRef } from "react";
import axios from "../../api/axios";

const ForgotPassword = ({ onForgotPasswordClose, onOpenOtp }) => {
  const emailRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleButtonClick = async () => {
    console.log(emailRef.current.value);
    const email = emailRef.current.value;
    const LOGIN_URL = `/users/forgot-password?email=${encodeURIComponent(
      email
    )}`;
    try {
      const response = await axios.post(
        LOGIN_URL,
        {}, // Ensuring JSON body
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white placeholder-gray-500"
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
                className="mt-8 bg-black text-gray-100 w-full py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
