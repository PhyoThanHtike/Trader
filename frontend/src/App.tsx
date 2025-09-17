import "./App.css";
import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Home from "./Pages/Home";
import { Suspense } from "react";
import Auth from "./Auth/Auth";
import About from "./Pages/About";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          // { path: "auth", element: <Auth /> },
        ],
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
