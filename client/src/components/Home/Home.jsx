import React from "react";
import ProductItemCard from "../ProductItemCard/ProductItemCard";

export default function Home() {
  return (
    <div className="home-wrapper mx-14 my-12 bg-white px-8 py-4 rounded-lg">
      <div className="product-wrapper">
        <div className="font-bold text-2xl mb-3">New arrivals</div>

        <div className="product-items">
          {[...Array(5)].map((_, _i) => {
            <ProductItemCard
              name={`Old spicy kernel with more fits`}
              price={"125.25"}
              id={`91070173890-81930`}
            />;
          })}
        </div>
      </div>
    </div>
  );
}
