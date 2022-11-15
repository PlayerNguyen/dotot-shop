import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ProductItemCard({ name, price, condition, id, image }) {
  return (
    <Link
      className={`
      productCard-wrapper block bg-zinc-100 rounded-xl
      cursor-pointer border border-zinc-400 hover:shadow-lg 
      transition-shadow ease-in-out`}
      to={`/products/${id}`}
    >
      {/* Header */}
      <div className="productCard-header">
        <div className="productCard-thumbnail-wrapper">
          <img
            className="bg-transparent w-full h-[180px] rounded-t-lg"
            src={image}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-1 items-start px-3 py-4">
        <div className="flex flex-row gap-2 items-center flex-1 w-full">
          <span className="bg-green-400 px-2 py-0.5 rounded-lg text-xs">
            {condition}
          </span>
        </div>
        <div>
          <span className="text-zinc-600">{name}</span>
        </div>
        <div className="w-full"></div>

        <div className="w-full flex flex-row-reverse items-center">
          <span className="mr-4 text-xl hover:bg-zinc-200 rounded-full p-2">
            <FiShoppingCart />
          </span>
          <p className="font-bold text-black flex-1 text-2xl">$ {price}</p>
        </div>
      </div>
    </Link>
  );
}
