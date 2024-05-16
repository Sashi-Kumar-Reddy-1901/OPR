import React from 'react';
import Logo from "../../logo.svg";
import {useState, useRef } from "react";
import axios from '../../api/axios';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import OTPValidation from '../OTP/OTPValidation';


const ForgotPassword = ({onForgotPasswordValidate}) => {
  const el = useRef(null);
  const [userEmail, setuserEmail] = useState('');
  const [openOTPScreen, setopenOTPScreen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height:350,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

 
  const handleCloseOTPScreen = () => setopenOTPScreen(false);
  const handleButtonClick = async () => {
    console.log(el.current.value);
    const email = el.current.value;
    setuserEmail(email);
    const LOGIN_URL = `/users/forgot-password?email=${encodeURIComponent(email)}`;
  
    try {
      const response = await axios.post(
          LOGIN_URL,{}, // Ensuring JSON body
          {
              headers: { 'Content-Type': 'application/json' },
  
          }
      );
      console.log(JSON.stringify(response?.data));
      console.log(response?.data?.data?.messageCode );
      if(response?.data?.data?.messageCode === 110201 || response?.data?.data?.messageCode === 110203 ){
         setopenOTPScreen(true);
         onForgotPasswordValidate();
      }else{
        setErrorMessage(response?.data?.data?.message);
      }
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
                  {/* <Link to="/dashboard" className="block w-full"> */}
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
                      <p > Reset </p>
                    </span>
                  </button>
                  {/* </Link>         */}
                  <p className="error-class">{ErrorMessage}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
  
      </div>

 
    </div>

    <Modal
        keepMounted
        open={openOTPScreen}
        onClose={handleCloseOTPScreen}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
         <OTPValidation onOTPValidate={handleCloseOTPScreen} userEmail = {userEmail} />
          </Box>
          </Modal>
  </>
  )
}

export default ForgotPassword