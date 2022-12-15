import React from "react";
import { FaBan, FaChair } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NoMatch() {
  const navigate = useNavigate();
  return (
    <div className="noMatch-wrapper bg-base">
      <div className="flex flex-col sm:my-24 md:my-48 my-6 mx-3 gap-6 items-center">
        <div className="text-6xl flex flex-row gap-4">
          <FaChair />
          <FaBan />
        </div>
        <div className=" text-3xl flex flex-col gap-4 items-center">
          <div className="text-red-400 font-bold">404 Not found</div>

          {/* Back to shopping */}
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate(`/`)}
          >
            Back to shopping
          </button>
        </div>
      </div>
    </div>
  );
}
