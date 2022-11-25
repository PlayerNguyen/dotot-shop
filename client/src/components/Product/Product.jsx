import React from "react";
import { Outlet } from "react-router-dom";

export default function Product() {
  return (
    <div className="product-wrapper bg-base-300">
      <div className="product-container sm:mx-24 sm:px-12 md:py-12 px-6 py-4 bg-base-100">
        <Outlet />
      </div>
    </div>
  );
}
