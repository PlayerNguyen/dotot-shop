import React, { useEffect, useState } from "react";
import {
  AiFillFacebook,
  AiFillGoogleSquare,
  AiFillMobile,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function CredentialSelection() {
  const navigate = useNavigate();

  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      navigate("/");
    }
  }, []);

  const location = useLocation();

  /**
   * Capture value ?redirect_from=value
   */
  useEffect(() => {
    if (location.search !== "") {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has("redirect_from")) {
        let redirectMessage = "";
        switch (searchParams.get("redirect_from")) {
          case "cart": {
            redirectMessage =
              "In order to purchase your stuffs, it would be great if you log in";
            break;
          }
          case "sell": {
            redirectMessage =
              "We understand you are a wise person when decide to choose us. One-more-step is just <b style='font-bold'>logging in</b> to sell your own products";
            break;
          }
        }

        setRedirectMessage(redirectMessage);
      }
    }
  }, [location]);

  return (
    <div className="credentialSelection-wrapper">
      <div className="mx-auto w-full sm:w-4/5 md:w-2/4 lg:w-2/4 my-32 md:my-48">
        {/* Title */}
        <div
          className="text-3xl mb-12"
          dangerouslySetInnerHTML={{ __html: redirectMessage }}
        ></div>

        <div className="flex flex-col gap-4">
          <button
            className="btn btn-primary flex flex-row gap-6"
            onClick={() => navigate("/users/sign-in")}
          >
            <i className="text-2xl">
              <AiFillMobile />
            </i>
            <p className="flex-1">Sign in phone number</p>
          </button>

          <button
            className="btn btn-primary flex flex-row gap-6"
            onClick={() => navigate("/users/sign-up")}
          >
            <i className="text-2xl">
              <AiOutlineUserAdd />
            </i>
            <p className="flex-1">Sign up</p>
          </button>

          <button
            className="btn bg-blue-400 flex flex-row gap-6"
            onClick={() => toast.error(`This feature are in development`)}
          >
            <i className="text-2xl">
              <AiFillFacebook />
            </i>
            <p className="flex-1">Sign in with Facebook</p>
          </button>

          <button
            className="btn bg-red-400 flex flex-row gap-6"
            onClick={() => toast.error(`This feature are in development`)}
          >
            <i className="text-2xl">
              <AiFillGoogleSquare />
            </i>
            <p className="flex-1">Sign in with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
}
