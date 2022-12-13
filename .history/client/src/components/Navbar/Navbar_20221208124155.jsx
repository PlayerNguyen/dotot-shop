import { useState } from "react";
import {
  AiFillSetting,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { ImExit } from "react-icons/im";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [cartSize, setCartSize] = useState(0);
  const [signedIn, setSignedIn] = useState(false);

  useState(() => {
    setSignedIn(localStorage.getItem("token") !== null);
  }, [localStorage]);

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
      <Link to="/sell">
          <h1 className="focus:outline-none text-white bg-lightgreen-700 hover:bg-lightgreen-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-lightgreen-600 dark:hover:bg-ligthtgreen-700 dark:focus:ring-lightgreen-800 ">Sell </h1>
          <span></span>
        </Link>
        {/* Search group */}
        <div>
          <div className=" input-group">
            <input
              className="input input-bordered input-sm"
              placeholder="Search for keywords"
            />
            <button className="btn btn-square btn-sm">
              <AiOutlineSearch />
            </button>
          </div>
        </div>
        {/* Link group */}
        <div className="menu menu-horizontal p-2 rounded-box text-md">
          {!signedIn ? (
            <li>
              <Link to={"/users/"}>
                <AiOutlineUser />
              </Link>
            </li>
          ) : (
            <li>
              <div className="dropdown dropdown-end dropdown-hover block">
                <label tabIndex={0}>
                  <AiOutlineUser />
                </label>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4 text-sm"
                >
                  <li className="block">
                    <Link to="/profile">
                      <AiFillSetting />
                      Profile
                    </Link>
                  </li>
                  <li className="block">
                    <Link to={`/users/sign-out`}>
                      <ImExit />
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          )}

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
