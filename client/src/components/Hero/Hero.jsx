import React from "react";

export default function Hero() {
  return (
    <div className="hero-wrapper">
      <div className="hero min-h-[50vh] min-w-[100vw] bg-zinc-50 flex flex-row items-start">
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
        <div className="hidden md:flex m-16 ">
          <div className="font-serif font-semibold italic flex md:flex-col ">
            <span className="text-5xl">Khmer Furniture</span>
            <small>Lets delight your decision</small>
          </div>
        </div>
      </div>
    </div>
  );
}
