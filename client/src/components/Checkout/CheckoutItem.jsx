import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";
import LazyImageLoader from "../LazyImageLoader/LazyImageLoader";

export default function CheckoutItem({ item, onRemove }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (item) {
      // console.log(`item `, item);
      // setImage(item.images[0]);
    }
  }, [item]);
  const handleRemoveItem = () => {
    onRemove(item.id);
  };

  return (
    <div className="checkOutItem-wrapper m-h-[180px]">
      {/* Info action */}
      <div className="flex flex-row-reverse">
        {/* remove the item */}
        <div>
          <button
            className="btn btn-ghost rounded-full"
            onClick={handleRemoveItem}
          >
            <BsTrash />
          </button>
        </div>
      </div>
      <div className="checkOutItem flex flex-row gap-4">
        {/* Left */}
        <div className="w-1/3">
          <LazyImageLoader
            src={`${
              image ? image : `${process.env.PRODUCTION_BASE_URL}/default.png`
            }`}
          />
        </div>

        {/* Right */}
        <div className="flex-1 w-2/3">
          {/* Info group */}
          <div className="text-xl font-bold">
            {item ? item.name : `[The product is deleted]`}
          </div>
          <div className="text-xl font-bold flex flex-row gap-1 text-base-content">
            <span>$</span>
            <span>
              {item
                ? item.salePrice === null
                  ? item.price
                  : item.salePrice
                : `[The product is deleted]`}
            </span>
            <span className="line-through text-sm">
              {item && item.salePrice !== null && item.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
