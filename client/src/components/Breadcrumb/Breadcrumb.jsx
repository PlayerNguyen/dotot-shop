import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  if (items === null || items === undefined) {
    throw new Error("Breadcrumb items cannot be null");
  }

  if (!Array.isArray(items)) {
    throw new Error("Breadcrumb items must be an array");
  }

  return (
    <div className="breadcrumb-wrapper">
      <div className="flex flex-row gap-2 items-center">
        {/* <a>Home</a>
        <a>Product</a> */}
        {items &&
          items.map((item, _i) => {
            return (
              <Link
                key={_i}
                to={item.to}
                className={
                  item.primary && item.primary
                    ? "text-primary font-bold text-sm"
                    : "text-base-300 text-sm"
                }
              >
                {item.name}
              </Link>
            );
          })}
      </div>
    </div>
  );
}
