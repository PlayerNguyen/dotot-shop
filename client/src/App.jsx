import React from "react";
import { FiMenu } from "react-icons/fi";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";

export default function App() {
  return (
    <div className="drawer bg-base-200">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-100 lg:px-12">
          {/* Navbar start section */}
          <div className="flex flex-row lg:hidden">
            <label htmlFor="app-drawer" className="drawer-button btn btn-ghost">
              <FiMenu className="text-xl" />
            </label>
          </div>

          <div className="flex-1 px-3">
            <h1 className="text-xl font-bold">dotot.com</h1>
          </div>

          <div className="hidden lg:block">
            <div className="menu menu-horizontal p-2 rounded-box">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>About</a>
              </li>
            </div>
          </div>
        </div>

        {/* Render home */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      {/* Drawer side */}
      <div className="drawer-side">
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
