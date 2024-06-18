import "./App.css";
import Body from "./Components/Body/Body";
import React, { useState } from "react";
import axiosInstance from "./api/axios";
import UnauthorizedDialog from "./Components/Unauthorized/UnauthorizedDialog";
import "./index.css"

function App() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertError, setAlertError] = useState("");

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    window.location.href = "/";
    localStorage.clear()
    sessionStorage.clear()
  };

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            console.log("Unauthorized", error.response.data);
            setAlertError(error.response.data?.message);
            setIsAlertOpen(true);
            break;
          case 403:
            console.error("Forbidden", error.response.data);
            break;
          case 404:
            console.error("Not Found", error.response.data);
            break;
          case 500:
            console.error("Server Error", error.response.data);
            break;
          default:
            console.error("Error response", error.response.data);
        }
      } else if (error.request) {
        console.error("Error request", error.request);
      } else {
        console.error("Error message", error.message);
      }
      return Promise.reject(error);
    }
  );

  return (
    <>
      <div>
        <Body />
      </div>

      <UnauthorizedDialog
        isOpen={isAlertOpen}
        errorMessage={alertError}
        onClose={handleCloseAlert}
      />
    </>
  );
}

export default App;
