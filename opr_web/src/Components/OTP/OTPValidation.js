import React, { useState } from "react";
import OtpInput from "react-otp-input";
import axios from '../../api/axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ResetPassword from "../ResetPassword/ResetPassword";

const OTPValidation = ({onOTPValidate,userEmail}) => {
  const [otp, setOtp] = useState("");
  const [openResetScreen, setopenResetScreen] = useState(false);

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


  const handleCloseResetScreen = () => setopenResetScreen(false);

  const handleButtonClick = async () => {

    const email = userEmail;
  
    const LOGIN_URL = `/users/validate-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
  
    try {
      const response = await axios.post(
          LOGIN_URL,{}, // Ensuring JSON body
          {
              headers: { 'Content-Type': 'application/json' },
  
          }
      );
      console.log(response?.data?.data?.data);  
      const token = response?.data?.data?.data;
      sessionStorage.setItem("token",token)
      if(token){
        setopenResetScreen(true);
        onOTPValidate();
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

      <Modal
        keepMounted
        open={openResetScreen}
        onClose={handleCloseResetScreen}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
         <ResetPassword onResetValidate={handleCloseResetScreen} />
          </Box>
          </Modal>
    </>
  );
};

export default OTPValidation;
