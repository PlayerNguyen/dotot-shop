import React, { useEffect, useRef, useState } from "react";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";
import { AiFillCodeSandboxCircle, AiOutlineEdit } from "react-icons/ai";
import {
  CgTrash,
  CgChevronLeft,
  CgChevronDoubleLeft,
  CgChevronRight,
  CgChevronDoubleRight,
} from "react-icons/cg";
import useDelayInput from "../../hooks/useDelayInput";
import useSetState from "../../hooks/useSetState";
import AdminProductEditModal from "./AdminProductEditModal";
import LazyImageLoader from "../LazyImageLoader/LazyImageLoader";

function ProductCardItem({ product, selected, onSelect }) {
  const [productImageUrl, setProductImageUrl] = useState(null);

  useEffect(() => {
    console.log(product);
    ProductRequest.getProductImages(product.Id).then((response) => {
      const { data } = ResponseInterceptor.filterSuccess(response);

      if (data.length > 0) {
        setProductImageUrl(data[0].Url);
      }
    });
  }, [product]);

  const handleOnSelect = () => {
    onSelect(product.Id);
  };

  return (
    <div className="productCardItem-wrapper">
      <div className="productCardItem-container flex flex-row py-3 gap-4">
        <div className="flex flex-col items-center justify-center gap-2 text-2xl">
          {/* Selected or not */}
          <div
            className={`w-[20px] h-[20px] rounded-full cursor-pointer hover:scale-105 focus:scale-110 ${
              selected ? `bg-base-content` : `bg-primary-focus`
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
          {/* <img src="http://localhost:3000/default.png" /> */}
          <LazyImageLoader
            src={
              productImageUrl
                ? productImageUrl
                : `http://localhost:3000/default.png`
            }
          />
        </div>
        {/* Info */}
        <div className="w-2/3">{product.Name}</div>
      </div>
    </div>
  );
}

function ProductPagination({
  page,
  totalPage,
  handleMoveFirstPage,
  handleMoveLastPage,
  handleIncreasePage,
  handleDecreasePage,
}) {
  return (
    <div className="items-center justify-center mx-auto w-2/3 text-center">
      <div className="btn-group !block w-full mx-auto">
        <button
          className="btn btn-sm"
          onClick={handleMoveFirstPage}
          disabled={page === 0}
        >
          <CgChevronDoubleLeft />
        </button>
        <button
          className="btn btn-sm"
          onClick={handleDecreasePage}
          disabled={page === 0}
        >
          <CgChevronLeft />
        </button>
        <button className="btn btn-sm">{page === 0 ? 1 : page + 1}</button>
        <button
          className="btn btn-sm"
          onClick={handleIncreasePage}
          disabled={page === totalPage}
        >
          <CgChevronRight />
        </button>
        <button
          className="btn btn-sm"
          onClick={handleMoveLastPage}
          disabled={page === 0}
        >
          <CgChevronDoubleRight />
        </button>
      </div>
    </div>
  );
}

export default function AdminProduct() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [InputDelayToSearch] = useState(600);
  const productListRef = useRef(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const selectedItem = useSetState();

  const fetchProducts = async () => {
    return ProductRequest.fetchProductParams(page, limit, searchBarValue).then(
      (response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        setProducts(data.products);
        setTotalPage(Math.round(data.totalSize / limit));
      }
    );
  };

  /**
   * Fetch whether page, limit change
   */
  useEffect(() => {
    setLoading(true);
    fetchProducts().finally(() => setLoading(false));
  }, [page, limit]);

  /**
   * To delay the input before executes fetch search
   */
  useDelayInput(
    () => {
      if (!loading) {
        fetchProducts();
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

  const handleIncreasePage = () => {
    if (page < totalPage) {
      setPage((page) => page + 1);
      productListRef.current.scrollIntoView();
    }
  };

  const handleToggleSelectItem = (id) => {
    selectedItem.has(id) ? selectedItem.remove(id) : selectedItem.add(id);
  };

  const handleDecreasePage = () => {
    if (page > 0) {
      setPage((page) => page - 1);
      productListRef.current.scrollIntoView();
    }
  };

  const handleMoveFirstPage = () => {
    setPage(0);
  };

  const handleMoveLastPage = () => {
    setPage(totalPage);
  };

  const handleRemoveAllSelected = () => {
    // Remove items
    const items = [...selectedItem.state.values()];
    // Send a delete method
    Promise.all(
      items.map((productId) => {
        return ProductRequest.deleteProduct(productId);
      })
    )
      .then((_responses) => {
        // Remove the item which is currently render
        items.forEach((itemId) => {
          setProducts(products.filter((product) => product.Id !== itemId));
        });
        // Clear set
        selectedItem.clear();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="adminProduct-wrapper">
      <div className="font-bold text-3xl py-3">Products</div>
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className=" flex flex-row gap-3">
          <input
            className="input input-md input-primary flex-1"
            type={"search"}
            placeholder="Search with ID, Name,..."
            onChange={handleSearchBarChange}
            value={searchBarValue}
          />
        </div>

        {/* Filter */}
        <div className="flex flex-row-reverse">
          {/* Size filter */}
          <div className="">
            <select
              className="select select-primary select-md"
              onChange={handleOnSelectFilterSize}
              value={limit ? limit : 30}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        {/* Show pagination */}
        <ProductPagination
          page={page}
          handleIncreasePage={handleIncreasePage}
          handleDecreasePage={handleDecreasePage}
          handleMoveFirstPage={handleMoveFirstPage}
          handleMoveLastPage={handleMoveLastPage}
          totalPage={totalPage}
        />

        <div
          className={`flex flex-row gap-3 mx-3 items-center ${
            selectedItem.state.size === 0 ? `text-base-300` : `text-primary`
          }`}
        >
          {/* Selected item */}
          <div className={`flex-1 `}>
            <b>{selectedItem.state.size} products</b>
          </div>

          <div>
            {/* Remove all items */}
            <button
              className="btn btn-outline btn-circle btn-accent btn-md text-lg"
              disabled={selectedItem.state.size === 0}
              onClick={handleRemoveAllSelected}
            >
              <CgTrash />
            </button>
          </div>
        </div>
        {/* Items list */}
        <div ref={productListRef}>
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(limit)].map((_e, i) => {
                return (
                  <div key={i}>
                    <div className="w-full h-[200px] bg-base-content animate-pulse"></div>
                  </div>
                );
              })}
            </div>
          ) : (
            products &&
            products.map((product) => {
              return (
                <ProductCardItem
                  product={product}
                  key={product.Id}
                  selected={selectedItem.has(product.Id)}
                  onSelect={(id) => {
                    handleToggleSelectItem(id);
                  }}
                />
              );
            })
          )}
        </div>

        <div className="divider "></div>

        {/* Show pagination */}
        <ProductPagination
          page={page}
          handleIncreasePage={handleIncreasePage}
          handleDecreasePage={handleDecreasePage}
          handleMoveFirstPage={handleMoveFirstPage}
          handleMoveLastPage={handleMoveLastPage}
          totalPage={totalPage}
        />
      </div>
      <AdminProductEditModal
        visible={isEditModalVisible}
        onClose={() => {
          setEditModalVisible(false);
        }}
        onCancel={() => {
          setEditModalVisible(false);
        }}
      />
    </div>
  );
}
