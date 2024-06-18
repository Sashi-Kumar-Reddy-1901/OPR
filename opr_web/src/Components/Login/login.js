import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../logo.svg";
import axiosInstance from "../../api/axios";
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
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ForgotPassword from "../Forgot-Password/ForgotPassword";
import OTPValidation from "../OTP/OTPValidation";
import ResetPassword from "../ResetPassword/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [ModuleData, setModuleData] = useState("");
  const [openSelectModule, setOpenSelectModule] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(false);
  const [isSiteKey, setIsSiteKey] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAlertError, setIsAlertError] = useState("");
  const [isLoggedInOpen, setIsLoggedInOpen] = useState(false);
  const [isLoggedInError, setIsLoggedInError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [openOTPDialog, setOpenOTPDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      const configUrl = `/common-utils/get_config_details`;
      try {
        const response = await axiosInstance.get(configUrl);
        console.log(response.data?.data);
        const isCaptchaEnabled = response.data?.data?.data?.isCaptchaEnabled;
        const isSiteKey = response.data?.data?.data?.siteKey;
        setIsCaptchaEnabled(isCaptchaEnabled);
        setIsSiteKey(isSiteKey);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (isLogout) => {
    try {
      const username = emailRef.current.value;
      const password = passwordRef.current.value;
      const LOGIN_URL = `/users/login?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}&isLogout=${isLogout}`;
      const loginResponse = await axiosInstance.post(LOGIN_URL, {});
      handleLoginResponse(loginResponse);
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    }
  };

  const handleLoginResponse = async (loginResponse) => {
    const token = loginResponse.data?.data?.data;
    const messageCode = loginResponse.data?.data?.messageCode;
    const message = loginResponse.data?.data?.message;

    if (messageCode === 110105) {
      setErrorMessage("");
      setIsAlertError(message);
      setIsAlertOpen(true);
    } else if (messageCode === 110101 && token) {
      sessionStorage.setItem("token", token);
      await fetchModulesAndRoles(false);
    } else if (messageCode === 110102) {
      setErrorMessage("");
      setIsLoggedInError(message);
      setIsLoggedInOpen(true);
    } else {
      setErrorMessage(message);
    }
  };

  const fetchModulesAndRoles = async (isChange) => {
    try {
      const modules_roles_Url = `users/get_user_modules_and_roles?isChange=${isChange}`;
      const moduleResponse = await axiosInstance.get(modules_roles_Url);
      const modulesData = moduleResponse.data?.data?.data;
      setModuleData(modulesData);
      if (modulesData) {
        handleModulesData(modulesData);
      } else {
        setErrorMessage("No modules data found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching modules data.");
    }
  };

  const handleModulesData = (modulesData) => {
    if (modulesData.length === 1 && modulesData[0].roles.length === 1) {
      const { moduleCode, roleCode } = modulesData[0];
      navigate(
        moduleCode === -1 && roleCode === -1 ? "./setup-table" : "./dashboard"
      );
    } else {
      setOpenSelectModule(true);
    }
  };

  const handleButtonClick = () => {
    localStorage.clear()
    sessionStorage.clear()
    toggleFullscreen();
    setErrorMessage("");
    handleLogin(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .catch((error) => {
          console.error("Fullscreen request failed:", error);
        });
    }
  };

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

  const handleOpenResetPassword = () => {
    setOpenResetPassword(true);
  };

  const handleCloseResetPassword = (resetSuccess) => {
    setOpenResetPassword(false);
    setErrorMessage("");
    if (resetSuccess) {
      toast.success(resetSuccess, {
        className: "custom-toast",
      });
    }
  };

  const handleCloseSelectModule = () => {
    setOpenSelectModule(false);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    setOpenForgotPassword(true);
  };

  const handleInputChange = () => {
    const username = emailRef.current?.value;
    const password = passwordRef.current?.value;
    setIsButtonDisabled(!username || !password);
  };

  const handleCloseNoLoggedIn = () => {
    setIsLoggedInOpen(false);
  };

  const handleCloseYesLoggedIn = () => {
    setIsLoggedInOpen(false);
    handleLogin(true);
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-white py-4">
          <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
            <img src={Logo} alt="1" className="header-image" />
          </div>
        </header>
        <div className="max-w-screen-xl m-0 sm:m-2 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-8">
            <div>
              <h1 className="text-4xl font-bold text-center">Finakon</h1>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <div className="w-full flex-1 mt-8">
                {/* Email and Password Inputs */}
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mx-auto max-w-xs">
                    <input
                      ref={emailRef}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-full font-medium bg-gray-100 border border-gray-500 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="User Id / Email"
                    />
                    <div
                      className="mb-2"
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        ref={passwordRef}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-full font-medium bg-gray-100 border border-gray-500 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
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
                          top: "2.4rem",
                          transform: "translateY(-50%)",
                          color: "#000",
                        }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </div>

                    {errorMessage && (
                      <p className="text-red-500 text-xs text-center max-h-0">
                        {errorMessage}
                      </p>
                    )}

                    <button
                      onClick={handleButtonClick}
                      disabled={isButtonDisabled}
                      className="rounded-full mt-8 tracking-wide font-semibold bg-black text-gray-100 w-full p-2 hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      Login{" "}
                    </button>
                    <div className="mt-2 text-center">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={handleOpenForgotPassword}
                      >
                        Forgot / Reset Password
                      </span>
                    </div>
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
        <footer className="bg-white text-black py-4">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
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

      {/* Change default password */}
      <Dialog open={isAlertOpen}>
        <DialogTitle>
          <span className="text-red-500 text-2xl text-center">Alert</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span className="text-black">{isAlertError}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <button
            type="button"
            onClick={handleCloseAlert}
            className="font-semibold bg-black text-gray-100 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
          >
            OK
          </button>
        </DialogActions>
      </Dialog>

      {/* Is Logged In */}
      <Dialog
        open={isLoggedInOpen}
        PaperProps={{
          sx: {
            maxWidth: "380px",
            width: "100%",
            maxHeight: "190px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: "36px" }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "14px" }}>
            <span className="text-black">{isLoggedInError}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-evenly", mb: 1 }}>
          <button
            type="button"
            onClick={handleCloseYesLoggedIn}
            className="bg-black text-gray-100 text-xs rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
          >
            YES
          </button>
          <button
            type="button"
            onClick={handleCloseNoLoggedIn}
            className="bg-black text-gray-100 text-xs rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
          >
            NO
          </button>
        </DialogActions>
      </Dialog>

      {isCaptchaEnabled && <GoogleReCaptchaProvider reCaptchaKey={isSiteKey} />}
    </>
  );
}

export default Login;
