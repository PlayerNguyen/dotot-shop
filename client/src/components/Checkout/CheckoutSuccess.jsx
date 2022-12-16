import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();

  const navigate = useNavigate();

  return (
    <div className="checkoutSuccess-wrapper px-6 py-12 sm:py-6 text-lg bg-base-100 flex flex-col gap-12 sm:gap-6 w-full sm:w-2/3 mx-auto sm:rounded-xl sm:my-6 md:w-3/5 lg:w-2/5">
      <div>
        The products that you are purchased now belonging to you, feel free and
        get a cup of coffee waiting for us to shipping to you
      </div>
      <div className="text-primary-focus text-sm">
        Transaction Id: {searchParams[0].get("id")}
      </div>
      <div>
        <button
          className="btn btn-primary w-full"
          onClick={() => navigate("/")}
        >
          Continue shopping
        </button>
      </div>
      {/* <div>
        <div className="font-bold text-xl">Maybe you would love it</div>
      </div>

      <div className=""></div> */}
    </div>
  );
}
