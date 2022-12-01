import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";

export default function CheckoutItem({ itemId }) {
  const [image, setImage] = useState(null);

  const handleRemoveItem = () => {};

  return (
    <div className="checkOutItem-wrapper m-h-[180px]">
      <div className="checkOutItem flex flex-row gap-4">
        {/* Left */}
        <div className="w-1/3 ">
          <div
            className={`productCard-thumbnail-wrapper w-full bg-cover bg-center h-[140px] sm:h-[180px]`}
            style={{
              backgroundImage: `url('${
                image ? image : `${process.env.PRODUCTION_BASE_URL}/default.png`
              }')`,
            }}
          ></div>
        </div>

        {/* Right */}
        <div className="flex-1">
          {/* Info group */}
          <div className="text-xl font-bold">Item name</div>
          <div className="text-xl text-primary font-bold">$ Item price</div>
        </div>

        {/* Info action */}
        <div>
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
      </div>
    </div>
  );
}
