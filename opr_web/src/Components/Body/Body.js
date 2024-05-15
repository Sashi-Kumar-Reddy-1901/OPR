import React from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from '../Login/login';
import Dashboard from '../Dashboard/Dashboard';
import Sidenav from '../Sidenav/Sidenav';
import ForgotPassword from '../Forgot-Password/ForgotPassword';
import OTPValidation from '../OTP/OTPValidation';

const Body = () => {
    const appRouter = createBrowserRouter([
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/inbox",
        element: <Sidenav />
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/otp-validation",
        element: <OTPValidation />
      }
    ]);
  return (
    <div>
     <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body