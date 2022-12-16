import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";

export default function ProductItemCard({
  name,
  price,
  condition,
  id,
  image,
  salePrice,
}) {
  const [isLoved, setIsLoved] = useState(false);
  const [imageList, setImageList] = useState([]);

  const handleClickLoveButton = () => {
    if (localStorage.getItem("token") === null) {
    }
    setIsLoved((loved) => !loved);
  };

  const navigate = useNavigate();

  useEffect(() => {
    ProductRequest.getProductImages(id).then((response) => {
      const { data } = ResponseInterceptor.filterSuccess(response);
      console.log(data);
      setImageList([...data]);
    });
  }, []);

  return (
    <div
      className={`
      productCard-wrapper sm:block bg-base-100 rounded-xl
      cursor-pointer border border-base-content hover:shadow-lg 
      transition-shadow ease-in-out duration-100 flex`}
      onClick={() => navigate(`/products/${id}`)}
    >
      <div className="flex flex-row w-full sm:flex-col">
        {/* Header */}
        <div className="productCard-header w-1/3 sm:w-full sm:h-full">
          <div
            className={`productCard-thumbnail-wrapper w-full h-full bg-cover bg-center rounded-l-xl sm:rounded-t-xl sm:rounded-bl-none sm:h-[210px]`}
            style={{
              backgroundImage: `url('${
                imageList.length === 0
                  ? `${process.env.PRODUCTION_BASE_URL}/default.png`
                  : `${imageList[0].Url}`
              }')`,
            }}
          ></div>
        </div>

        {/* Item description */}
        <div className="flex flex-row sm:flex-row w-2/3 sm:w-full">
          {/* Description group */}
          <div className="flex flex-col sm:gap-1 mt-1 items-start px-3 py-4 flex-1">
            <div className="flex flex-row gap-2 items-center flex-1 w-full">
              <span className=" badge badge-primary">{condition}</span>
            </div>

            <div>
              <span className="text-base-content text-sm">{name}</span>
            </div>
            <div className="w-full"></div>

            <div className="w-full flex flex-row-reverse items-center gap-2">
              <div className="text-xs flex-1 flex flex-col">
                <span className="line-through text-md">
                  {salePrice && price}
                </span>
                {/* <span>
                {salePrice && Number.parseInt((salePrice / price) * 100) + `%`}
              </span> */}
              </div>
              <p className="font-bold text-base-content flex-1 text-2xl">
                ${salePrice ? salePrice : price}
              </p>
            </div>
          </div>
          {/* Action group */}
        </div>
      </div>
    </div>
  );
}
