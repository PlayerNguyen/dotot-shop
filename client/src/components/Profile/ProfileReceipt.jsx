import { React, useEffect, useState } from "react";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import ProductRequest from "../../requests/ProductRequest";

export default function ProfileReceipt() {
  const [data, setData] = useState([]);
  useEffect(() => {
    ProductRequest.getMyPurchase().then((response) => {
      const { data } = ResponseInterceptor.filterSuccess(response);
      setData(data);
      // console.log(data);
    });
  }, []);

  return (
    <div className="flex flex-col py-3 px-6">
      <div className="text-2xl font-bold">Your purchase</div>
      <div>
        {data && data.length === 0 ? (
          <div className="text-xl">You are not purchase anything yet</div>
        ) : (
          data.map(({ Order, Products }) => {
            {
              /* console.log(Products); */
            }
            return (
              <div key={Order.Id} className="flex flex-col py-3">
                {/* Header */}
                <div className="bg-primary text-primary-content px-6 py-4 rounded-xl">
                  {Order.Id}
                </div>

                {/* Body */}
                {Products &&
                  Products.map((product) => {
                    return (
                      <div
                        key={product.productId}
                        className="flex flex-col px-6 py-4"
                      >
                        <div className="py-3 flex flex-row">
                          <b className="flex-1">{product.ProductName}</b>
                          <span className="">$ {product.ProductPrice}</span>
                        </div>
                        <div>
                          <ul className="steps">
                            <li
                              className={`step ${
                                (product.Status === `pending` ||
                                  product.Status === `accepted` ||
                                  product.Status === `delivering` ||
                                  product.Status === `sold`) &&
                                `step-primary`
                              }`}
                            >
                              Pending
                            </li>
                            <li
                              className={`step ${
                                (product.Status === `accepted` ||
                                  product.Status === `delivering` ||
                                  product.Status === `sold`) &&
                                `step-primary`
                              }`}
                            >
                              Accepted
                            </li>
                            <li
                              className={`step ${
                                (product.Status === `delivering` ||
                                  product.Status === `sold`) &&
                                `step-primary`
                              }`}
                            >
                              Delivering
                            </li>
                            <li
                              className={`step ${
                                product.Status === `sold` && `step-primary`
                              }`}
                            >
                              Receive Product
                            </li>
                          </ul>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
