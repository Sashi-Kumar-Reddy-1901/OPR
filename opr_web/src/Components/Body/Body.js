import React from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from '../Login/login';
import Dashboard from '../Dashboard/Dashboard';
import Sidenav from '../Sidenav/Sidenav';
import ForgotPassword from '../Forgot-Password/ForgotPassword';
import OTPValidation from '../OTP/OTPValidation';
import SetupTable from '../Set-up Table/Set-upTable';
import Entity from '../Entity/Entity';
import { checkAuthLoader } from '../../utils/auth';

const Body = () => {

 

    const appRouter = createBrowserRouter([
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        loader: checkAuthLoader
      },
      {
        path: "/inbox",
        element: <Sidenav />
      },
  
      {
        path: "/setup-table",
        element: <SetupTable />,
        loader: checkAuthLoader
      },
      {
        path: "/entity",
        element: <Entity />,
        loader: checkAuthLoader
      }
    ]);
  return (
    <div>
     <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body