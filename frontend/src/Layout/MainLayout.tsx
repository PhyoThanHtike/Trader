import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="bg-gradient-to-b from-blue-50 to-purple-50 
    dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
