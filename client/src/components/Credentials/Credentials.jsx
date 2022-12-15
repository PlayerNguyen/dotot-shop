import React from "react";
import { Outlet } from "react-router-dom";

export default function Credentials() {
  return (
    <div className="credentials-wrapper ">
      {/* Container */}

      <div className="credential-container bg-base-200 px-6 py-2 ">
        <Outlet />
      </div>
    </div>
  );
}
