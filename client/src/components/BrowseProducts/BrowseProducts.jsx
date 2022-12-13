import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";

function ProductItem({ product }) {
  return (
    <div className="productItem-wrapper border w-full rounded-md">
      <div className="flex flex-row">
        {/* Thumbnail */}
        <div className="w-1/3">
          <img src={"http://localhost:3000/default.png"} />
        </div>
        {/* Information */}
        <div className="flex flex-col px-3 py-2 w-2/3">
          <div className="text-sm font-bold">{product.Name}</div>
          <div className="text-sm font-bold text-primary">
            $ {product.Price}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(30);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log(page);
    // const abortController = new AbortController();
    ProductRequest.fetchProductParams(page, limit, search)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        setProducts(data);
      })
      .catch((response) => {
        // console.log(response);
        const { message } = ResponseInterceptor.filterError(response);
        toast.error(message);
      });

    // return () => {
    //   abortController.abort();
    // };
  }, [search, page]);

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleViewMore = () => {
    setPage((page) => page + 1);
  };

  return (
    <div className="browserProducts-wrapper">
      <div className="flex flex-col gap-4 bg-white px-12 py-3">
        {/* Search */}
        <div className="w-full">
          <input
            className="input input-sm input-primary  w-full"
            placeholder={`Find your wished furniture...`}
            onChange={handleChangeSearch}
          />
        </div>

        {/* Product list */}
        <div className="flex flex-col gap-4">
          {products &&
            products.map((product) => {
              {
                /* console.log(product); */
              }
              return <ProductItem key={product.Id} product={product} />;
            })}
        </div>

        {/* Views more */}
        <div>
          <button
            className="btn btn-ghost text-center w-full"
            onClick={handleViewMore}
          >
            View more
          </button>
        </div>
      </div>
    </div>
  );
}
