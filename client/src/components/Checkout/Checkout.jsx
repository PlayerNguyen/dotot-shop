import React, { useState, useEffect } from "react";
import CheckoutItem from "./CheckoutItem";
import { AiFillPlusCircle } from "react-icons/ai";
import AddressManagerDialog from "../AddressManagerDialog/AddressManagerDialog";
import UserRequest from "../../requests/UserRequest";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem } from "../../slices/CartSlice";

export default function Checkout() {
  const [items, setItems] = useState(["", "", ""]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [paymentType, setPaymentType] = useState(1);

  const [addressVisible, setAddressVisible] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  useEffect(() => {
    if (cartItems) {
      setItems(cartItems);
    }
  }, [cartItems]);

  useEffect(() => {
    const abortController = new AbortController();
    UserRequest.getUserAddressList().then((response) => {
      const { data } = ResponseInterceptor.filterSuccess(response);
      setAddressList(data);
      setSelectedAddress(0);
    });

    return () => {
      abortController.abort();
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

  const handleChangeAddress = (index) => {
    setSelectedAddress(index);
  };

  const handleRemoveCartItem = (itemId) => {
    dispatch(removeCartItem(itemId));
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
          {items &&
            items.map((item, _index) => {
              return (
                <CheckoutItem itemId={item} onRemove={handleRemoveCartItem} />
              );
            })}
        </div>
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
                        checked={selectedAddress === _index}
                        onChange={() => {
                          handleChangeAddress(_index);
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
        <hr />
        {/* Footer */}
        <div className="flex flex-col gap-4">
          {/* Listing all items */}
          <div className="flex flex-row">
            <div className="flex-1">Total</div>
            {/* List outer */}
            <div>
              {/* List  */}
              <ul>
                {["a", "b", "c", "d"].map((item, index) => {
                  return (
                    <li>
                      <span className="mr-3 text-base-300">Product {item}</span>
                      <span>costA</span>
                    </li>
                  );
                })}
                <li>
                  <span></span>
                  <span>
                    {/* Total of all cost */}
                    <div className="font-bold">Total cost</div>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action footer */}
          <div className="flex flex-row-reverse">
            <button className="btn btn-primary">Purchase</button>
          </div>
        </div>
      </div>
      <AddressManagerDialog
        visible={addressVisible}
        onUpdate={handleAddressUpdate}
        onClose={handleCloseAddressManager}
      />
    </div>
  );
}
