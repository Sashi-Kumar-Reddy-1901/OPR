import React, { useState } from "react";
import OtpInput from "react-otp-input";
import axios from '../../api/axios';

const OTPValidation = () => {
  const [otp, setOtp] = useState("");

  const handleButtonClick = async () => {

    const email = "pratik.raj@smartgig.tech"
  
    const LOGIN_URL = `/users/validate-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
  
    try {
      const response = await axios.post(
          LOGIN_URL,{}, // Ensuring JSON body
          {
              headers: { 'Content-Type': 'application/json' },
  
          }
      );
      console.log(JSON.stringify(response?.data));
      console.log(response?.data?.data?.messageCode );
  
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
  
      console.log(accessToken);
      console.log(roles);
  } catch(error){

  }
  };

  return (
    <>
      <div className="bg-gray-100 text-gray-900 flex flex-col">
        <div className="max-w-screen-xl m-0 sm:m-2 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className=" p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">
                OTP
              </h1>
              <div className="w-full flex-1 mt-8">
                {/* Email and Password Inputs */}
                <form onSubmit={(e) => e.preventDefault()}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                  />
                  <button 
                    onClick={handleButtonClick}
                   className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPValidation;
