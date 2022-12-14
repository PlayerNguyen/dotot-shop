import React from "react";
import { AiOutlineShopping, AiOutlineShoppingCart } from "react-icons/ai";
import { BsCashCoin } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <div className="hero-wrapper">
      <div className="hero min-h-[50vh] min-w-[100vw] bg-base-100 flex flex-row items-start">
        <div
          className={`lg:w-1/3 w-full min-h-[50vh] 
            bg-[url('https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80')]
            bg-center bg-cover relative
            `}
        >
          <div className="md:hidden absolute font-serif font-semibold italic mx-auto left-[15%] top-[10%] flex flex-col">
            <span className="text-5xl">Khmer Furniture</span>
            <small>Lets delight your decision</small>
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-6 m-16">
          <div className="font-serif font-semibold italic flex md:flex-col ">
            <span className="text-5xl">Khmer Furniture</span>
            <small>Lets delight your decision</small>
          </div>
          <div className="py-4 flex flex-row gap-3 w-full">
            {/* Buy button */}
            <button
              className="rounded-xl hover:bg-base-200 ease-in-out hover:shadow-md border-base-content border transition-all bg-base-100 flex flex-col gap-4 px-12 py-5 items-center"
              onClick={() => navigate("/browse-products")}
            >
              <span className="text-6xl">
                <AiOutlineShoppingCart />
              </span>
              <span className="uppercase font-bold">I want to buy</span>
            </button>
            {/* Sell button */}
            <button
              className="rounded-xl hover:bg-base-200 ease-in-out hover:shadow-md border-base-content border transition-all bg-base-100 flex flex-col gap-4 px-12 py-5 items-center"
              onClick={() => navigate("/sell")}
            >
              <span className="text-6xl">
                <BsCashCoin />
              </span>
              <span className="uppercase font-bold">I want to SELL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
