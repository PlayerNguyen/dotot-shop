import React, { useState, useEffect } from "react";
import CheckoutItem from "./CheckoutItem";
import { AiFillPlusCircle } from "react-icons/ai";
import AddressManagerDialog from "../AddressManagerDialog/AddressManagerDialog";
import UserRequest from "../../requests/UserRequest";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem, clearCartItem } from "../../slices/CartSlice";
import useRequestAuthenticate from "../../hooks/useRequestAuthenticate";
import { TbShoppingCartOff } from "react-icons/tb";
import { FaMoneyBillAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ProductRequest from "../../requests/ProductRequest";

function CheckoutWrapper({ children }) {
  useRequestAuthenticate("/users/?redirect_from=cart");

  return children;
}

function CheckoutRender() {
  const [items, setItems] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [paymentType, setPaymentType] = useState(1);

  const [addressVisible, setAddressVisible] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems) {
      setItems(cartItems);
    }
  }, [cartItems]);

  // Get data information
  useEffect(() => {
    if (cartItems) {
      console.log(cartItems);
      // Fetch product information
      Promise.all(
        [...cartItems].map((itemId) =>
          ProductRequest.fetchProduct(itemId).then((response) => {
            const { data } = ResponseInterceptor.filterSuccess(response);
            return data;
          })
        )
      ).then((results) => setItems([...results]));
    }

    return () => {
      setItems([]);
    };
  }, [cartItems]);

  useEffect(() => {
    // const abortController = new AbortController();
    if (localStorage.getItem("token") !== null) {
      UserRequest.getUserAddressList().then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        setAddressList(data);
        setSelectedAddress(data.length === 0 ? null : data[0].Id);
      });
    }

    return () => {
      // abortController.abort();
    };
  }, []);

  const handleAddressUpdate = (addresses) => {
    setAddressList(addresses);
  };

  const handleCloseAddressManager = () => {
    setAddressVisible(false);
  };

  const handleOpenAddressManager = () => {
    setAddressVisible(true);
  };

  const handleChangeAddress = (id, index) => {
    setSelectedAddress(id);
  };

  const handleRemoveCartItem = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  const handlePurchase = () => {
    // console.log(selectedAddress, items);
    const products = [...items].map((item) => {
      return {
        ProductName: item.name,
        ProductId: item.id,
        ProductPrice: item.salePrice !== null ? item.salePrice : item.price,
        ProductCondition: item.condition,
      };
    });

    ProductRequest.postCreateOrder(selectedAddress, products).then(
      (response) => {
        // console.log(response);
        const { data } = ResponseInterceptor.filterSuccess(response);
        // Clear cart item
        dispatch(clearCartItem());

        // Navigate to success
        navigate(`/checkout-success/?id=${data.Id}`);
      }
    );
  };

  return (
    <div className="checkOut-wrapper">
      {/* Checkout container */}
      <div className="checkOut-container mx-auto w-full sm:w-3/4 md:w-2/3  bg-base-100 px-12 py-4 flex flex-col gap-6">
        {/* Header */}
        <div className="checkOut-header flex flex-col">
          <div className="font-bold text-4xl">Checkout</div>
          {/* <div className="text-base-300">small item here</div> */}
        </div>

        {/* Body */}
        <div className="checkOut-body flex flex-col gap-4">
          {/* List of items */}
          {items && items.length > 0 ? (
            items.map((item, _index) => {
              return <CheckoutItem item={item} />;
            })
          ) : (
            <div className="my-6 sm:my-8 md:my-10 lg:my-14">
              <div className="flex flex-col justify-center items-center text-2xl text-primary-content">
                <span>
                  <TbShoppingCartOff />
                </span>
                <span>
                  Your cart is super quite now.{" "}
                  <Link
                    to="/browse-products/"
                    className="link text-base-content"
                  >
                    Go for shopping
                  </Link>
                </span>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            {/* Payment type */}
            <div className="payment-type-selection">
              <div className="text-xl font-bold">Payment type</div>
              <div className="w-full sm:w-1/2 mx-auto">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="payment-cod"
                      className="radio checked:bg-primary"
                      checked={paymentType === 1}
                      onChange={(e) => {
                        setPaymentType(1);
                      }}
                    />
                    <span className="label-text">Cash on Delivery</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="payment-momo"
                      className="radio checked:bg-primary"
                      onChange={() => {
                        setPaymentType(2);
                      }}
                      checked={paymentType === 2}
                    />
                    <span className="label-text">Payment via MoMo Service</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            {/* Address */}
            <div className="address">
              <div className="text-xl font-bold">Address</div>
              <div className="w-full sm:w-1/2 mx-auto">
                {addressList &&
                  addressList.map((address, _index) => {
                    {
                      /* console.log(address); */
                    }
                    const {
                      Id,
                      ContactPhone,
                      ProvinceName,
                      DistrictName,
                      WardName,
                      StreetName,
                    } = address;
                    return (
                      <div
                        className="form-control bg-zinc-50 px-4 rounded-xl mb-2 text-sm"
                        key={Id}
                      >
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name={`address-${Id}`}
                            className="radio checked:bg-primary mr-4"
                            checked={selectedAddress === Id}
                            onChange={() => {
                              handleChangeAddress(Id, _index);
                            }}
                          />
                          <div className="w-full">
                            <b>{StreetName}</b>
                            <div>
                              {WardName}, {DistrictName}, {ProvinceName}
                            </div>
                            <span>{ContactPhone}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
              </div>

              {/* Add more address */}
              <button
                className="btn btn-ghost w-full"
                onClick={handleOpenAddressManager}
              >
                <AiFillPlusCircle className="mr-6" />
                <span>Add address</span>
              </button>
            </div>
            <div className="divider"></div>
            {/* Footer */}
            <div className="flex flex-col gap-4">
              {/* Listing all items */}
              <div className="flex flex-row">
                <div className="flex-1">Total</div>
                {/* List outer */}
                <div>
                  {/* List  */}
                  <ul className=" text-success">
                    {[...items].map((item, _index) => {
                      return (
                        <li>
                          <span className="mr-3">Product {item.name}</span>
                          <span>
                            {item && item.salePrice !== null
                              ? item.salePrice
                              : item.price}
                          </span>
                        </li>
                      );
                    })}
                    <div className="divider"></div>
                    <li className="flex flex-row gap-4">
                      <span>
                        {/* Total of all cost */}
                        <div className="font-bold">Total cost</div>
                      </span>
                      <span>
                        {items.reduce(
                          (prev, current) =>
                            prev +
                            (current.salePrice !== null
                              ? current.salePrice
                              : current.price),
                          0
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action footer */}
              <div className="flex flex-row-reverse">
                <button
                  className="btn btn-primary flex flex-row gap-4"
                  disabled={items.length === 0}
                  onClick={handlePurchase}
                >
                  <span>
                    <FaMoneyBillAlt />
                  </span>
                  <span>Purchase</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <AddressManagerDialog
        visible={addressVisible}
        onUpdate={handleAddressUpdate}
        onClose={handleCloseAddressManager}
      />
    </div>
  );
}
export default function Checkout() {
  return (
    <CheckoutWrapper>
      <CheckoutRender />
    </CheckoutWrapper>
  );
}
