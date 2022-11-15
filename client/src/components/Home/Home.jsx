import React, { useState } from "react";
import ProductItemCard from "../ProductItemCard/ProductItemCard";

export default function Home() {
  const [products, setProducts] = useState([
    {
      name: "Modern Chair Desk",
      price: "38.25",
      id: "123",
      condition: "99%",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Giant Vertux Lamp",
      price: "129.25",
      id: "39x9",
      condition: "99%",
      salePrice: "110.25",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Old Workbench Desk",
      price: "39.25",
      id: "k9ud90-a98djd9-kaid0x",
      condition: "97%",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Modern Chair Desk",
      price: "38.25",
      id: "123",
      condition: "99%",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Giant Vertux Lamp",
      price: "129.25",
      id: "39x9",
      condition: "99%",
      salePrice: "110.25",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Old Workbench Desk",
      price: "39.25",
      id: "k9ud90-a98djd9-kaid0x",
      condition: "97%",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Modern Chair Desk",
      price: "38.25",
      id: "123",
      condition: "99%",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Giant Vertux Lamp",
      price: "129.25",
      id: "39x9",
      condition: "99%",
      salePrice: "110.25",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
    {
      name: "Old Workbench Desk",
      price: "39.25",
      id: "k9ud90-a98djd9-kaid0x",
      condition: "97%",
      image: `https://dummyimage.com/600x400/000/fff`,
    },
  ]);
  return (
    <div className="home-wrapper mx-4 px-6 pb-4 rounded-lg">
      <div className="product-wrapper">
        <div className="font-bold text-5xl my-8 font-serif text-center">
          New arrivals
        </div>

        <div className="product-items block">
          {products.map((_, _i) => (
            <div className="w-1/2 md:w-1/5 px-4 py-4 inline-block">
              <ProductItemCard
                name={_.name}
                price={_.price}
                id={_.id}
                condition={_.condition}
                image={_.image}
                salePrice={_.salePrice}
                key={_.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
