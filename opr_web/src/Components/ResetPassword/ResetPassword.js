import React, { useState, useRef } from "react";
import axios from '../../api/axios';

const ResetPassword = ({onResetValidate}) => {
    const emId = useRef(null);
    const pass = useRef(null);

    const handleButtonClick = async () => {

        const email = emId.current.value;
        const password = pass.current.value;
        const token = sessionStorage.getItem("token");
        const LOGIN_URL = `/users/reset-password?userId=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      
        try {
          const response = await axios.post(
              LOGIN_URL,{}, // Ensuring JSON body
              {
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
      
              }
          );
          console.log(response?.data?.data?.messageCode); 
          if(response?.data?.data?.messageCode === 110501){
            onResetValidate();
          }

    
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
                Reset Password
              </h1>
              <div className="w-full flex-1 mt-8">
                {/* Email and Password Inputs */}
                <form onSubmit={(e) => e.preventDefault()}>
                <div className="mx-auto max-w-xs">
                <input
                    ref={emId}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="User Id / Email"
                  />
                     <input
                    ref={pass}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="password"
                    placeholder="Password"
                  />
                <button 
                    onClick={handleButtonClick}
                   className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                    Submit
                  </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
   </>
  )
}

export default ResetPassword