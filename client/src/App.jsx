import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import SignUp from "./components/Credentials/SignUp";
import Credentials from "./components/Credentials/Credentials";
import NoMatch from "./components/NoMatch/NoMatch";
import SignIn from "./components/Credentials/SignIn";
import Navbar from "./components/Navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";
import CredentialSelection from "./components/Credentials/CredentialSelection";
import SignOut from "./components/Credentials/SignOut";
import Product from "./components/Product/Product";

export default function App() {
  return (
    <div className="drawer bg-base-200">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Render home */}
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/users" element={<Credentials />}>
              {/* TODO: check whether user is logged in or not, to put current */}
              <Route index element={<CredentialSelection />} />
              <Route path="/users/sign-up" element={<SignUp />} />
              <Route path="/users/sign-in" element={<SignIn />} />
              <Route path="/users/sign-out" element={<SignOut />} />
            </Route>
            <Route path="/products" element={<Product />}>
              <Route path=":productId" element={<Product />} />
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

      <ToastContainer />
    </div>
  );
}
