import React, { useEffect, useState } from "react";
import { AiFillSetting, AiFillTags } from "react-icons/ai";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [adminMenuItems] = useState([
    {
      name: "Products",
      url: "/admin/products",
      icon: <AiFillSetting />,
    },
    { name: `Categories`, url: `/admin/categories`, icon: <AiFillTags /> },
  ]);

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <div className="adminLayout-wrapper">
      <div className=" bg-white w-full sm:w-2/3 md:w-3/5 lg:w-2/5 mx-auto sm:my-3 sm:px-3 sm:py-4 sm:rounded-md flex flex-col">
        <div className="flex flex-row overflow-x-scroll w-full px-3">
          {adminMenuItems &&
            adminMenuItems.map((item, _i) => {
              return (
                <Link
                  to={item.url}
                  key={_i}
                  className={`btn btn-ghost btn-sm flex flex-row gap-2 ${
                    pathname === item.url ? "btn-active" : ""
                  }`}
                >
                  <i>{item.icon && item.icon}</i>
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </div>
        <div className="divider"></div>
        <div className="px-4 py-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
