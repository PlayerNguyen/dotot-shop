import React from "react";
import { FiMenu } from "react-icons/fi";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import SignUp from "./components/Credentials/SignUp";
import Credentials from "./components/Credentials/Credentials";
import NoMatch from "./components/NoMatch/NoMatch";
import SignIn from "./components/Credentials/SignIn";

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
            <Link to="/">
              <h1 className="text-xl font-bold">Khmer Furniture</h1>
            </Link>
          </div>

          {/* Wide screen  */}
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

          {/* For small screen */}
          <div className="lg:hidden">
            <div className="menu menu-horizontal p-2 rounded-box">
              {/* Shopping cart */}
              <li>
                <a className="text-3xl relative">
                  <AiOutlineShoppingCart />
                  <span className="absolute text-sm left-2 top-2 bg-red-400 px-2 rounded-full text-white">
                    3
                  </span>
                </a>
              </li>
              {/* Search */}
              <li>
                <a className="text-3xl relative">
                  <AiOutlineSearch />
                </a>
              </li>
            </div>
          </div>
        </div>

        {/* Render home */}
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/users" element={<Credentials />}>
              <Route path="/users/sign-up" element={<SignUp />} />
              <Route path="/users/sign-in" element={<SignIn />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>

        {/* Footer */}
        <Footer />
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
