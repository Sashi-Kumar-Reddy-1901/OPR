import React from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from '../Login/login';
import Dashboard from '../Dashboard/Dashboard';
import Sidenav from '../Sidenav/Sidenav';
import ForgotPassword from '../Forgot-Password/ForgotPassword';

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
      }
    ]);
  return (
    <div>
     <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body