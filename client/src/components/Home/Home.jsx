import React, { useState, useEffect, Suspense } from "react";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";
const ProductItemCard = React.lazy(() =>
  import("../ProductItemCard/ProductItemCard")
);
const Hero = React.lazy(() => import("../Hero/Hero"));

export default function Home() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    ProductRequest.fetchAllProducts(controller)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        setProducts(data.products);
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="home-wrapper ">
      {/* Hero of the page */}
      <Suspense>
        <Hero />
      </Suspense>
      {/* Product showcase ~ New arrivals */}
      <div className="product-wrapper mx-4 px-2 pb-4 rounded-lg">
        <div className="font-bold text-5xl my-8 font-serif text-center">
          New arrivals
        </div>

        <div className="product-items block">
          {products &&
            products.map((_, _i) => (
              <div
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 px-4 py-4 inline-block"
                key={_i}
              >
                <Suspense
                  fallback={
                    <div className="">
                      <div></div>
                    </div>
                  }
                >
                  <ProductItemCard
                    name={_.Name}
                    price={_.Price}
                    id={_.Id}
                    condition={_.Condition}
                    image={_.image}
                    salePrice={_.SalePrice}
                  />
                </Suspense>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
