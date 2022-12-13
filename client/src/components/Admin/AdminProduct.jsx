import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";
import { AiOutlineEdit } from "react-icons/ai";
import useDelayInput from "../../hooks/useDelayInput";

function ProductCardItem({ product, selected, onSelect }) {
  const handleOnSelect = () => {
    onSelect(product.Id);
  };
  return (
    <div className="productCardItem-wrapper">
      <div className="productCardItem-container flex flex-row py-3 gap-4">
        <div className="flex flex-col items-center justify-center gap-2 text-2xl">
          {/* Selected or not */}
          <div
            className={`w-[20px] h-[20px] rounded-full ${
              selected ? `bg-primary` : `bg-zinc-200`
            }`}
            onClick={handleOnSelect}
          ></div>
          {/* Edit */}
          <div className="">
            <button className="btn btn-ghost btn-sm text-2xl">
              <AiOutlineEdit />
            </button>
          </div>
        </div>
        {/* Image */}
        <div className="w-1/3">
          <img src="http://localhost:3000/default.png" />
        </div>
        {/* Info */}
        <div className="w-2/3">{product.Name}</div>
      </div>
    </div>
  );
}

export default function AdminProduct() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBarValue, setSearchBarValue] = useState("");

  const [InputDelayToSearch] = useState(400);

  /**
   * Fetch whether page, limit change
   */
  useEffect(() => {
    setLoading(true);
    ProductRequest.fetchProductParams(page, limit, searchBarValue)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        setProducts(data);
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  /**
   * To delay the input before executes fetch search
   */
  useDelayInput(
    () => {
      if (!loading) {
        ProductRequest.fetchProductParams(page, limit, searchBarValue).then(
          (response) => {
            const { data } = ResponseInterceptor.filterSuccess(response);
            setProducts(data);
          }
        );
      }
    },
    InputDelayToSearch,
    [searchBarValue, page, limit]
  );

  const handleSearchBarChange = (e) => {
    setSearchBarValue(e.target.value);
  };

  const handleOnSelectFilterSize = (e) => {
    setLimit(Number.parseInt(e.target.value));
  };

  return (
    <div className="adminProduct-wrapper">
      <div className="font-bold text-3xl py-3">Products</div>
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className=" flex flex-row gap-3">
          <input
            className="input input-sm input-primary flex-1"
            type={"search"}
            placeholder="Search with ID, Name,..."
            onChange={handleSearchBarChange}
            value={searchBarValue}
          />
          {/* <button
            className="btn btn-sm btn-primary"
            disabled={searchBarValue.length === 0}
          >
            <FaSearch />
          </button> */}
        </div>

        {/* Filter */}
        <div className="flex flex-row-reverse">
          {/* Size filter */}
          <div className="">
            <select
              className="select select-primary select-xs"
              onChange={handleOnSelectFilterSize}
              value={limit ? limit : 30}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Items list */}
        <div>
          {products &&
            products.map((product) => {
              return (
                <ProductCardItem
                  product={product}
                  key={product.Id}
                  selected={true}
                  onSelect={(id) => {
                    alert(id);
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
