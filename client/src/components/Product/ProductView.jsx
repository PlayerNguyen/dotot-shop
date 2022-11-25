import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { AiFillShopping, AiOutlineShoppingCart } from "react-icons/ai";

export default function ProductView() {
  let { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ProductRequest.fetchProduct(productId)
      .then((response) => {
        setProduct(ResponseInterceptor.filterSuccess(response).data);
      })
      .catch((response) => {
        const { message } = ResponseInterceptor.filterError(response);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <div className="productView-wrapper">
      <div className="productView-container flex md:flex-row gap-8 flex-col">
        <div className="productView-image md:w-1/4">
          <img
            src={`${process.env.PRODUCTION_BASE_URL}/default.png`}
            className="w-full"
          />
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
            $ {product && product.price}
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-4">
            <div>
              <button className="btn btn-outline flex flex-row gap-4 btn-sm">
                <AiOutlineShoppingCart />
                <span>Add to cart</span>
              </button>
            </div>
            <div>
              <button className="btn btn-outline flex flex-row gap-4 btn-sm">
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
