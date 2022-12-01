import React, { useState } from "react";
import CheckoutItem from "./CheckoutItem";

export default function Checkout() {
  const [items, setItems] = useState(["a"]);
  return (
    <div className="checkOut-wrapper">
      {/* Checkout container */}
      <div className="checkOut-container mx-auto w-full sm:w-3/4 md:w-2/3  bg-base-100 px-12 py-4 flex flex-col">
        {/* Header */}
        <div className="checkOut-header flex flex-col">
          <div className="font-bold text-4xl">Checkout</div>
          <div className="text-base-300">small item here</div>
        </div>

        {/* Body */}
        <div className="checkOut-body flex flex-col">
          {/* List of items */}
          {items &&
            items.map((item, _index) => {
              return <CheckoutItem />;
            })}
        </div>
      </div>
    </div>
  );
}
