import React, { useState } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ProductItemCard({
  name,
  price,
  condition,
  id,
  image,
  salePrice,
}) {
  return (
    <Link
      className={`
      productCard-wrapper block bg-zinc-100 rounded-xl
      cursor-pointer border border-zinc-400 hover:shadow-lg 
      transition-shadow ease-in-out duration-100`}
      to={`/products/${id}`}
    >
      {/* Header */}
      <div className="productCard-header">
        <div className="productCard-thumbnail-wrapper">
          <img
            className="bg-transparent w-full h-[180px] md:h-[150px] rounded-t-lg"
            src={image}
            alt={`${id}s product thumbnail`}
          />
        </div>
      </div>

      {/* Item description */}
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-1 mt-1 items-start px-3 py-4 flex-1">
          <div className="flex flex-row gap-2 items-center flex-1 w-full">
            <span className="bg-green-400 px-2 py-0.5 rounded-lg text-xs">
              {condition}
            </span>
          </div>

          <div>
            <span className="text-zinc-600">{name}</span>
          </div>
          <div className="w-full"></div>

          <div className="w-full flex flex-row-reverse items-center gap-2">
            <div className="text-xs flex-1 flex flex-col">
              <span className="line-through ">{salePrice && price}</span>
              <span>
                {salePrice && Number.parseInt((salePrice / price) * 100) + `%`}
              </span>
            </div>
            <p className="font-bold text-black flex-1 text-2xl">
              ${salePrice ? salePrice : price}
            </p>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col sm:px-2 p-3 gap-2">
          <span
            className={`
          text-zinc-400 text-xl hover:bg-zinc-200 rounded-full p-2
          ease-in-out transition-colors hover:text-black`}
          >
            <FiHeart />
          </span>
          <span
            className={`
          text-zinc-400 text-xl hover:bg-zinc-200 rounded-full p-2
          ease-in-out transition-colors hover:text-black`}
          >
            <FiShoppingCart />
          </span>
        </div>
      </div>
    </Link>
  );
}
