import "./App.css";
import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./Pages/Dashboard";
import HomeLayout from "./AppComponents/Sidebar/HomeLayout";
import { Suspense } from "react";
import Auth from "./Auth/Auth";
import About from "./Pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // <Outlet /> renders here
    children: [
      {
        element: (
            <HomeLayout />

        ),
        children: [
          { index: true, element: <Dashboard/> },
        ],
      },
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;


          // { path: "profile", element: <Profile /> },
          // { path: "request", element: <Request /> },
          // { path: "template", element: <Template /> },
          // {
          //   path: "received",
          //   element: <ReceivedRequests />,
          // },
          // { path: "history", element: <History /> },
          // {
          //   path: "received/:id",
          //   element: <SigningPage />,
          // },