import React from 'react';
import Logo from "../../logo.svg";
import { useRef } from "react";
import axios from '../../api/axios';
import { Link } from "react-router-dom";


const ForgotPassword = () => {
  const el = useRef(null);
  const handleButtonClick = async () => {
    console.log(el.current.value);
    const email = el.current.value;
    const LOGIN_URL = `/users/forgot-password?email=${encodeURIComponent(email)}`;
  
    try {
      const response = await axios.post(
          LOGIN_URL,{}, // Ensuring JSON body
          {
              headers: { 'Content-Type': 'application/json' },
  
          }
      );
      console.log(JSON.stringify(response?.data));
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
      {/* Header */}
      {/* <header className="bg-gray-200 py-4">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          <img src={Logo} alt="1" className="header-image" />
          <img src={Logo} alt="2" className="header-image" />
          <img src={Logo} alt="3" className="header-image" />
          <img src={Logo} alt="4" className="header-image" />
          <img src={Logo} alt="5" className="header-image" />
        </div>
      </header> */}

      <div className="max-w-screen-xl m-0 sm:m-2 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className=" p-6 sm:p-8">
    
          <div className="flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Forgot Password</h1>
            <div className="w-full flex-1 mt-8">
              {/* Email and Password Inputs */}
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mx-auto max-w-xs">
                  <input
                    ref={el}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="User Id / Email"
                  />
               
                  {/* Sign Up Button */}
                  <Link to="/dashboard" className="block w-full">
                  <button
                    onClick={handleButtonClick}
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">
                      <Link to="/dashboard"> Reset</Link>{" "}
                    </span>
                  </button>
                  </Link>

                  {/* Terms of Service and Privacy Policy */}
                
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div> */}
      </div>

      {/* Footer */}
      {/* <footer className="bg-gray-200 text-gray-600 py-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <p style={{ margin: "0" }}>Powered by Finakon</p>
        </div>
      </footer> */}
    </div>
  </>
  )
}

export default ForgotPassword