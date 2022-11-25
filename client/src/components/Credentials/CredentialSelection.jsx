import React, { useEffect } from "react";
import {
  AiFillFacebook,
  AiFillGoogleSquare,
  AiFillMobile,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CredentialSelection() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      navigate("/");
    }
  }, []);

  return (
    <div className="credentialSelection-wrapper">
      <div className="mx-auto w-full md:w-1/4 my-32 md:my-48">
        {/* Title */}
        <div className="font-bold text-3xl"></div>

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
