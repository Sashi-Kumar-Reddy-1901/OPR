import { useEffect, useRef, useState } from "react";
import Logo from "../../logo.svg";
import axios from "../../api/axios";
import "./login.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SelectModule from "../SelectModule/SelectModule";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Zoom,
  Tooltip,
} from "@mui/material";
import ForgotPassword from "../Forgot-Password/ForgotPassword";
import OTPValidation from "../OTP/OTPValidation";
import ResetPassword from "../ResetPassword/ResetPassword";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [ModuleData, setModuleData] = useState("");
  const [passworderrorMessage, setpassworderrorMessage] = useState("");
  const [openSelectModule, setOpenSelectModule] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const configUrl = `/common-utils/get_config_details`;
      try {
        const response = await axios.get(configUrl);
        console.log(response.data?.data);
        const isCaptchaEnabled = response.data?.data?.data?.isCaptchaEnabled;
        setIsCaptchaEnabled(isCaptchaEnabled);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,15}$/;

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
    try {
      const username = emailRef.current.value;
      const password = passwordRef.current.value;
      const isLogout = true;
      const LOGIN_URL = `/users/login?username=${encodeURIComponent(username)}
      &password=${encodeURIComponent(password)}&isLogout=${isLogout}`;
      const loginResponse = await axios.post(
        LOGIN_URL,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = loginResponse.data?.data?.data;
      sessionStorage.setItem("token", token);

      if (token) {
        const url = "users/get_user_modules_and_roles";
        const moduleResponse = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const modulesData = moduleResponse.data?.data?.data;
        console.log("Modules and roles:", modulesData);
        setModuleData(modulesData);
        if (modulesData !== null) {
          setOpenSelectModule(true);
        } else {
          setErrorMessage("No modules data found.");
        }
      } else {
        setErrorMessage(loginResponse?.data?.data?.message);
      }
    } catch (error) {
      console.log("Error:", error.response?.data?.error);
      setErrorMessage("An error occurred while processing your request.");
    }
  };

  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
  };
  const handleCloseForgotPassword = (otpSentSuccess) => {
    setOpenForgotPassword(false);
    if (otpSentSuccess) {
      toast.success(otpSentSuccess, {
        className: "custom-toast",
      });
    }
  };

  const [userEmail, setUserEmail] = useState("");

  const [openOTPDialog, setOpenOTPDialog] = useState(false);
  const handleOpenOTPDialog = (email) => {
    setUserEmail(email);
    setOpenOTPDialog(true);
  };
  const handleCloseOTPDialog = (otpSuccess) => {
    setOpenOTPDialog(false);
    if (otpSuccess) {
      toast.success(otpSuccess, {
        className: "custom-toast",
      });
    }
  };

  const [openResetPassword, setOpenResetPassword] = useState(false);
  const handleOpenResetPassword = () => {
    setOpenResetPassword(true);
  };

  const handleCloseResetPassword = (resetSuccess) => {
    setOpenResetPassword(false);
    if (resetSuccess) {
      toast.success(resetSuccess, {
        className: "custom-toast",
      });
    }
  };

  const handleCloseSelectModule = () => {
    setOpenSelectModule(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-black py-4">
          <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
            <img src={Logo} alt="1" className="header-image" />
            {/* <img src={Logo} alt="2" className="header-image" />
            <img src={Logo} alt="3" className="header-image" />
            <img src={Logo} alt="4" className="header-image" />
            <img src={Logo} alt="5" className="header-image" /> */}
          </div>
        </header>
        <div className="max-w-screen-xl m-0 sm:m-2 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-8">
            <div>
              <p className="text-xl font-serif font-semibold text-black">
                Finakon
              </p>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <div className="w-full flex-1 mt-8">
                {/* Email and Password Inputs */}
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mx-auto max-w-xs">
                    <input
                      ref={emailRef}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
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
                        ref={passwordRef}
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
                          color: "#000",
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
                        width: "0",
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
                            backgroundColor: "#000",
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
                    {errorMessage && (
                      <p className="text-red-500 text-xs text-center max-h-0">
                        {errorMessage}
                      </p>
                    )}

                    <button
                      onClick={handleButtonClick}
                      className="mt-6 tracking-wide font-semibold bg-black text-gray-100 w-full py-4 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >Login </button>
                    <p
                      className="mt-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleOpenForgotPassword}
                    >
                      {" "}
                      Forgot / Reset Password?
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gray-100 text-center hidden lg:flex">
            <div className="w-full bg-cover bg-center bg-no-repeat bg-Image"></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-white py-4">
          <div className="max-w-screen-xl mx-auto px-4">
            <p style={{ margin: "0" }}>Powered by Finakon®</p>
          </div>
        </footer>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Forgot Password */}
      <Dialog
        onClose={handleCloseForgotPassword}
        aria-labelledby="customized-dialog-title"
        open={openForgotPassword}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px",
            width: "100%",
            maxHeight: "300px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
          Forgot / Reset Password
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseForgotPassword}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography gutterBottom component="div">
            <ForgotPassword
              onForgotPasswordClose={handleCloseForgotPassword}
              onOpenOtp={handleOpenOTPDialog}
            />
          </Typography>
        </DialogContent>
      </Dialog>

      {/* OTP Screen */}
      <Dialog
        onClose={handleCloseOTPDialog}
        aria-labelledby="customized-dialog-title"
        open={openOTPDialog}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px",
            width: "100%",
            maxHeight: "300px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
          Enter OTP
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseOTPDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography gutterBottom component="div">
            <OTPValidation
              userEmail={userEmail}
              onOtpClose={handleCloseOTPDialog}
              onResetPasswordOpen={handleOpenResetPassword}
            />
          </Typography>
        </DialogContent>
      </Dialog>

      {/*Reset Password Screen */}
      <Dialog
        onClose={handleCloseResetPassword}
        aria-labelledby="customized-dialog-title"
        open={openResetPassword}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px",
            width: "100%",
            maxHeight: "350px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
          Reset Password
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseResetPassword}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography gutterBottom component="div">
            <ResetPassword onResetPasswordClose={handleCloseResetPassword} />
          </Typography>
        </DialogContent>
      </Dialog>

      {/*Select Module and Roles */}
      <Dialog
        onClose={handleCloseSelectModule}
        aria-labelledby="customized-dialog-title"
        open={openSelectModule}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px",
            width: "100%",
            maxHeight: "300px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
          Select Module and Role
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSelectModule}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography gutterBottom component="div">
            <SelectModule
              ModuleData={ModuleData}
              onCloseSelectModule={handleCloseSelectModule}
            />
          </Typography>
        </DialogContent>
      </Dialog>

      {isCaptchaEnabled && (
        <GoogleReCaptchaProvider reCaptchaKey="6LcMd94pAAAAAINUGy7ryI2evYPunp4mqYghKCxZ" />
      )}
    </>
  );
}

export default Login;
