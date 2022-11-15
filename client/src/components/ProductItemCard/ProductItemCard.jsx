import React from "react";
import { Link } from "react-router-dom";

export default function ProductItemCard({ name, price, condition, id }) {
  return (
    <Link className="productCard-wrapper cursor-pointer" to={`/products/${id}`}>
      {/* Header */}
      <div className="productCard-header">
        <div className="productCard-thumbnail-wrapper">
          <img className="bg-gray-100 w-full h-[180px]" />
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-1 items-start">
        <div className="flex flex-row gap-2 items-center">
          <span className="bg-yellow-300 text-yellow-700 px-2 py-0.5 rounded-lg">
            medium
          </span>
          <span className="text-stone-400">{name}</span>
        </div>
        <p className="font-bold text-red-500">$ {price}</p>
      </div>
    </Link>
  );
}
