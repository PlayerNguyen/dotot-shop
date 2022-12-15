import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { AiFillShopping, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  addCartItem,
  clearCartItem,
  removeCartItem,
} from "../../slices/CartSlice";

import LazyImageLoader from "../LazyImageLoader/LazyImageLoader";

function ProductCarousel({ images }) {
  const [currentSelectIndex, setCurrentSelectIndex] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex-1 border">
          <LazyImageLoader
            src={images[currentSelectIndex].Url}
            blurHash={images[currentSelectIndex].blurHash}
            className={"w-full"}
          />
        </div>
      </div>
      <div className="w-full flex flex-row gap-4">
        {images &&
          images.length > 1 &&
          images.map((img, idx) => {
            return (
              <div
                className={`flex-1 ${
                  idx === currentSelectIndex && `border`
                } cursor-pointer`}
                key={img.Id}
                onClick={() => setCurrentSelectIndex(idx)}
                tabIndex={0}
              >
                <LazyImageLoader src={img.Url} blurHash={img.blurHash} />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function ProductView() {
  let { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);

    ProductRequest.fetchProduct(productId)
      .then((response) => {
        setProduct(ResponseInterceptor.filterSuccess(response).data);
        console.log(ResponseInterceptor.filterSuccess(response).data);
      })
      // .then(() => ProductRequest.getProductImages(productId))
      // .then((response) => {
      //   console.log(response);
      // })
      .catch((response) => {
        const { message } = ResponseInterceptor.filterError(response);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (cartItems.includes(productId)) {
      dispatch(removeCartItem(productId));
    } else {
      dispatch(addCartItem(productId));
    }
  };

  const handlePurchase = () => {
    if (!cartItems.includes(productId)) {
      dispatch(addCartItem(productId));
    }
    navigate("/checkout");
  };

  const navigate = useNavigate();

  return (
    <div className="productView-wrapper">
      <div className="productView-container flex md:flex-row gap-8 flex-col">
        <div className="productView-image md:w-1/4">
          {!product ? (
            <img
              src={`${process.env.PRODUCTION_BASE_URL}/default.png`}
              className="w-full"
            />
          ) : (
            product.images && <ProductCarousel images={product.images} />
          )}
        </div>

        <div className="flex-1 flex-col flex gap-4">
          <Breadcrumb
            items={[
              {
                name: "Home",
                to: "/",
              },
              {
                name: "Product",
                to: `/products/`,
              },
              {
                name: product && product.category && product.category.name,
                to: "/",
              },
              {
                name: product && product.name,
                to: `/products/${productId}`,
                primary: true,
              },
            ]}
          />
          <div className="text-4xl font-bold">
            {loading ? (
              <div className="h-[32px] bg-base-200 w-full animate-pulse"></div>
            ) : (
              product && product.name
            )}
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            ${" "}
            {product &&
              (product.salePrice === null ? product.price : product.salePrice)}
            {/* If sale  */}
            <span className="text-base-content !text-sm mr-3 line-through">
              {product && product.salePrice && product.price}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-4">
            <div>
              <button
                className="btn btn-outline flex flex-row gap-4 btn-sm"
                onClick={handleAddToCart}
              >
                <AiOutlineShoppingCart />
                <span>
                  {cartItems
                    ? !cartItems.includes(productId)
                      ? `Add to cart`
                      : `Remove`
                    : `Add to cart`}
                </span>
              </button>
            </div>
            <div>
              <button
                className="btn btn-outline flex flex-row gap-4 btn-sm"
                onClick={handlePurchase}
              >
                <AiFillShopping />
                <span>Buy</span>
              </button>
            </div>
          </div>

          <div className="text-slate-500">{product && product.description}</div>
        </div>
      </div>
    </div>
  );
}
