import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../Login/login";
import Dashboard from "../Dashboard/Dashboard";
import SetupTable from "../Set-up Table/Set-upTable";
import Entity from "../Entity/Entity";
import { checkAuthLoader } from "../../utils/auth";
import EntityDetails from "../EntityDetails/EntityDetails";
import EntityUpload from "../EntityUpload/EntityUpload";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "entity",
          element: <Entity />,
          loader: checkAuthLoader,
        },
        {
          path: "entity-details",
          element: <EntityDetails />,
          loader: checkAuthLoader,
        },
        {
          path: "entity-upload",
          element: <EntityUpload />,
          loader: checkAuthLoader,
        },
      ],
      loader: checkAuthLoader,
    },
    {
      path: "/setup-table",
      element: <SetupTable />,
      loader: checkAuthLoader,
    },
    {
      path: "/entity",
      element: <Entity />,
      loader: checkAuthLoader,
    },
    
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
