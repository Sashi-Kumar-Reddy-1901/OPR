import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Logo from "../../logo.svg";
import axios from "../../api/axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./login.css";
import ForgotPassword from "../Forgot-Password/ForgotPassword";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const email = useRef(null);
  const pass = useRef(null);
  const [password, setPassword] = useState("");

  const [errorMessage, seterrorMessage] = useState(false);
  const [passworderrorMessage, setpassworderrorMessage] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,15}$/;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (passwordRegex.test(newPassword)) {
      setpassworderrorMessage("");
    } else {
      setpassworderrorMessage(
        "Password must be 8-15 characters long and include at least one number, one lowercase letter, one uppercase letter, and one special character."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleButtonClick = async () => {
    console.log(email.current.value);
    console.log(pass.current.value);
    const username = email.current.value;
    const password = pass.current.value;
    const isLogout = true;
    // const LOGIN_URL = '/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&isLogout=${isLogout}';
    const LOGIN_URL = `/users/login?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}&isLogout=${isLogout}`;
    try {
      const response = await axios.post(
        LOGIN_URL,
        {}, // Ensuring JSON body
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      console.log(response?.data?.data?.data);
      if (response?.data?.data?.data !== null) {
        navigate("/dashboard");
      } else {
        seterrorMessage(response?.data?.data?.message);
        console.log(errorMessage);
      }

      console.log(accessToken);
      console.log(roles);
    } catch (error) {}
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
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        ref={pass}
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        maxLength={15}
                        minLength={8}
                      />
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "2.8rem",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </div>
                    <div
                      style={{
                        position: "relative",
                        left: "21rem",
                        top: "-2.2rem",
                      }}
                    >
                      <Tooltip
                        title={
                          <span style={{ fontSize: "14px" }}>
                            The password must be 8-15 characters long and
                            include at least one number, one lowercase letter,
                            one uppercase letter, and one special character from
                            !@#$%^&*().
                          </span>
                        }
                        placement="right"
                        arrow
                        TransitionComponent={Zoom}
                      >
                        <button
                          style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "15px",
                            height: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            outline: "none",
                            fontSize: "12px",
                          }}
                        >
                          i
                        </button>
                      </Tooltip>
                    </div>
                    <p className="errorMessage">{errorMessage}</p>

                    <button
                      onClick={handleButtonClick}
                      className="mt-3 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
                      <span className="ml-3">Login</span>
                    </button>

                    {/* Terms of Service and Privacy Policy */}
                    {/* <Link to="/forgot-password">
                    <p className="mt-6 text-xs text-gray-600 text-center">
                     Forgot Password?
                    </p>
                    </Link> */}
                    <p
                      className="mt-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleOpenForgotPassword}
                    >
                      Reset / Forgot password
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gray-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat bg-Image"
              // style={{
              //   backgroundImage:
              //     "url('../../Images/opsriskbg_adobe_express.svg')",
              // }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 text-gray-600 py-4">
          <div className="max-w-screen-xl mx-auto px-4">
            <p style={{ margin: "0" }}>Powered by Finakon ®</p>
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
          <ForgotPassword  onForgotPasswordValidate={handleCloseForgotPassword}/>
        </Box>
      </Modal>
    </>
  );
}

export default Login;
