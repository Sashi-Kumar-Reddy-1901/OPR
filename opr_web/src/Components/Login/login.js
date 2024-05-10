import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import Logo from "../../logo.svg";
import axios from '../../api/axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import "./login.css";
import ForgotPassword from "../Forgot-Password/ForgotPassword";
import { padding } from "@mui/system";



function Login() {
  const email = useRef(null);
  const pass = useRef(null);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
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

  const handleButtonClick = async () => {
    console.log(email.current.value);
    console.log(pass.current.value);
    const username = email.current.value;
    const password = pass.current.value;
    const isLogout = true;
    // const LOGIN_URL = '/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&isLogout=${isLogout}';
    const LOGIN_URL = `/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&isLogout=${isLogout}`;
    try {
      const response = await axios.post(
          LOGIN_URL,
           {}, // Ensuring JSON body
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

  const handleOpenForgotPassword = () => setOpenForgotPassword(true);
  const handleCloseForgotPassword = () => setOpenForgotPassword(false);
  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-gray-200 py-4">
          <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
            <img src={Logo} alt="1" className="header-image" />
            <img src={Logo} alt="2" className="header-image" />
            <img src={Logo} alt="3" className="header-image" />
            <img src={Logo} alt="4" className="header-image" />
            <img src={Logo} alt="5" className="header-image" />
          </div>
        </header>
 
        <div className="max-w-screen-xl m-0 sm:m-2 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-8">
            <div>
              <p className="text-xl font-serif font-semibold text-blue-500">
                Finakon
              </p>
            </div>
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
              <div className="w-full flex-1 mt-8">
                {/* Email and Password Inputs */}
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mx-auto max-w-xs">
                    <input
                      ref={email}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      placeholder="User Id / Email"
                    />
                    <input
                      ref={pass}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password"
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
                         Login
                      </span>
                    </button>
                    </Link>
 
                    {/* Terms of Service and Privacy Policy */}
                    {/* <Link to="/forgot-password">
                    <p className="mt-6 text-xs text-gray-600 text-center">
                     Forgot Password?
                    </p>
                    </Link> */}
                     <p onClick={handleOpenForgotPassword}>Forgot password</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
            ></div>
          </div>
        </div>
 
        {/* Footer */}
        <footer className="bg-gray-200 text-gray-600 py-4">
          <div className="max-w-screen-xl mx-auto px-4">
            <p style={{ margin: "0" }}>Powered by Finakon</p>
          </div>
        </footer>
      </div>

      <Modal
        keepMounted
        open={openForgotPassword}
        onClose={handleCloseForgotPassword}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <ForgotPassword />
          </Box>
          </Modal>
    </>
  );
}

export default Login;
