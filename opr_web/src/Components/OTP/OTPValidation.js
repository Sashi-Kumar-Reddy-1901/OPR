import React, { useState } from "react";
import OtpInput from "react-otp-input";
import axios from "../../api/axios";
import './OTPValidation.css'

const OTPValidation = ({ onOtpClose, userEmail ,onResetPasswordOpen}) => {
  console.log(userEmail);
  const [otp, setOtp] = useState("");

  const handleButtonClick = async () => {
    const email = userEmail;
    console.log(email);
    const LOGIN_URL = `/users/validate-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
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
      if (token) {
        onOtpClose();
        onResetPasswordOpen()
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex-1">
          <form onSubmit={(e) => e.preventDefault()}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle="otp-input"
              containerStyle="otp-container"
            />
            <button
              onClick={handleButtonClick}
              className="mt-8 bg-black text-gray-100 w-full py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* <Modal
        keepMounted
        open={openResetScreen}
        onClose={handleCloseResetScreen}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <ResetPassword onResetValidate={handleCloseResetScreen} />
        </Box>
      </Modal> */}
    </>
  );
};

export default OTPValidation;
