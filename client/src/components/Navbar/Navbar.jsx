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
    <div className="navbar bg-base-300 lg:px-12">
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
        {/* <Link to="/sell">
          <h1 className="inline-block px-6 py-2.5 bg-gray-200 text-gray-700 font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out">
            Sell{" "}
          </h1>
          <span></span>
        </Link> */}
        {/* Search group */}
        {/* <div>
          <div className=" input-group">
            <input
              className="input input-bordered input-sm"
              placeholder="Search for keywords"
            />
            <button className="btn btn-square btn-sm">
              <AiOutlineSearch />
            </button>
          </div>
        </div> */}
        {/* Link group */}
        <div className="menu menu-horizontal p-2 rounded-box text-md">
          <div className="flex items-stretch gap-3">
            {!signedIn ? (
              <li>
                <Link to={"/users/"}>
                  <AiOutlineUser />
                </Link>
              </li>
            ) : (
              <div className="dropdown dropdown-end ">
                <label tabIndex={0} className="btn btn-ghost text-xl">
                  <AiOutlineUser />
                  {/* here */}
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
