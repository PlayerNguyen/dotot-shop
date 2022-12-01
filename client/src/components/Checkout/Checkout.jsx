import React, { useState } from "react";
import CheckoutItem from "./CheckoutItem";

export default function Checkout() {
  const [items, setItems] = useState(["", "", ""]);
  const [purchaseLoading, setPurchaseLoading] = useState(false)

  return (
    <div className="checkOut-wrapper">
      {/* Checkout container */}
      <div className="checkOut-container mx-auto w-full sm:w-3/4 md:w-2/3  bg-base-100 px-12 py-4 flex flex-col gap-6">
        {/* Header */}
        <div className="checkOut-header flex flex-col">
          <div className="font-bold text-4xl">Checkout</div>
          {/* <div className="text-base-300">small item here</div> */}
        </div>

        {/* Body */}
        <div className="checkOut-body flex flex-col gap-4">
          {/* List of items */}
          {items &&
            items.map((item, _index) => {
              return <CheckoutItem />;
            })}
        </div>
        <hr />
        {/* Footer */}
        <div className="flex flex-col gap-4">
          {/* Listing all items */}
          <div className="flex flex-row">
            <div className="flex-1">Total</div>
            {/* List outer */}
            <div>
              {/* List  */}
              <ul>
                {["a", "b", "c", "d"].map((item, index) => {
                  return (
                    <li>
                      <span className="mr-3 text-base-300">Product {item}</span>
                      <span>costA</span>
                    </li>
                  );
                })}
                <li>
                  <span></span>
                  <span>
                    {/* Total of all cost */}
                    <div className="font-bold">Total cost</div>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action footer */}
          <div className="flex flex-row-reverse">
            <button className="btn btn-primary">Purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
}
