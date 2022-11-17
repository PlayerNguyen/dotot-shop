import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";

export default function Credentials() {
  return (
    <div className="credentials-wrapper ">
      {/* Container */}

      <div className="credential-container bg-white px-6 py-2 ">
        <Outlet />
      </div>
    </div>
  );
}
