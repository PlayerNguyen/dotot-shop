import React, { useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [cartSize, setCartSize] = useState(0);

  return (
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
      <div className="hidden lg:flex flex-row gap-1 text-2xl">
        {/* Search group */}
        <div>
          <div className="flex flex-row text-xl items-center gap-4">
            <input
              className="input input-bordered input-sm"
              placeholder="Search for keywords"
            />
            <span>
              <AiOutlineSearch />
            </span>
          </div>
        </div>
        {/* Link group */}
        <div className="menu menu-horizontal p-2 rounded-box text-md">
          <li>
            <Link to={"/users/"}>
              <AiOutlineUser />
            </Link>
          </li>
          <li>
            <Link to={"/checkout"} className="relative">
              <AiOutlineShoppingCart />
              {cartSize && cartSize > 0 ? (
                <span className="text-sm ">{cartSize}</span>
              ) : null}
            </Link>
          </li>
        </div>
      </div>

      {/* For small screen */}
      <div className="lg:hidden">
        <div className="menu menu-horizontal p-2 rounded-box text-xl">
          {/* Shopping cart */}
          <li>
            <a className="relative">
              <span>
                <AiOutlineShoppingCart />
              </span>
              {cartSize && cartSize > 0 ? (
                <span className="absolute text-sm left-2 top-2 bg-red-400 px-2 rounded-full text-white">
                  {cartSize}
                </span>
              ) : null}
            </a>
          </li>
          {/* Search */}
          <li>
            <a className="relative">
              <AiOutlineSearch />
            </a>
          </li>
        </div>
      </div>
    </div>
  );
}
