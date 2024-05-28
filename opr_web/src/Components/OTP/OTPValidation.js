import React, { useState } from "react";
import OtpInput from "react-otp-input";
import axios from "../../api/axios";
import "./OTPValidation.css";

const OTPValidation = ({ onOtpClose, userEmail, onResetPasswordOpen }) => {
  console.log(userEmail);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const handleButtonClick = async () => {
    const email = userEmail;
    console.log(email);
    const LOGIN_URL = `/users/validate-otp?email=${encodeURIComponent(
      email
    )}&otp=${encodeURIComponent(otp)}`;
    try {
      const response = await axios.post(
        LOGIN_URL,
        {}, // Ensuring JSON body
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response?.data?.data?.data);
      const token = response?.data?.data?.data;
      sessionStorage.setItem("token", token);
      if (response?.data?.data?.messageCode === 110401) {
        setErrorMessage(response?.data?.data?.message);
      } else if (response?.data?.data?.messageCode === 110402) {
        setErrorMessage(response?.data?.data?.message);
      } else if (response?.data?.data?.messageCode === 110404) {
        setErrorMessage(response?.data?.data?.message);
      } else if (response?.data?.data?.messageCode === 110406) {
        setErrorMessage(response?.data?.data?.message);
      } else {
        onOtpClose(response?.data?.data?.message);
        onResetPasswordOpen()
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex-1">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mt-6 mb-4">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => <input {...props} />}
                inputStyle="otp-input"
                containerStyle="otp-container"
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
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTPValidation;
