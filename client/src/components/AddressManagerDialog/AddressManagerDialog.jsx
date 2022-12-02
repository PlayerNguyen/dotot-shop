import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import UserRequest from "../../requests/UserRequest";
import { AiFillCloseCircle, AiOutlineDelete } from "react-icons/ai";

export default function AddressManagerDialog({ visible, ...children }) {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    setLoading(true);
    UserRequest.getUserAddressList()
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleToggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <div className="addressManagerDialog-wrapper bg-black bg-opacity-70 fixed top-0 left-0 w-[100vw] h-[100vh]">
      {/*  Content  */}
      <div className="bg-white mx-auto w-full sm:w-4/5 lg:w-1/4 md:w-2/4 sm:mt-12 sm:rounded-xl px-6 py-4">
        {/* Header */}
        <div className="flex flex-row items-center">
          <div className="font-bold text-2xl flex-1">Address</div>
          <div className="text-3xl sm:text-xl">
            <AiFillCloseCircle />
          </div>
        </div>

        {/* Body */}
        <div className="my-4">
          {/* Addresses */}
          <div className="flex flex-col h-[40vh] max-h-[40vh] overflow-y-auto">
            {[...Array(10)].map((item) => {
              return (
                <div className="flex flex-row px-4 items-center border-b">
                  <div className="flex-1">
                    <div className="">street name</div>
                    <div>more address here</div>
                    <div className="font-bold">+84 12345678</div>
                  </div>
                  {/* Action */}
                  <div>
                    <div className="btn text-xl rounded-full text-accent btn-ghost">
                      <AiOutlineDelete />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <hr />
        {/* Editor */}
        <div className="addressEditor flex flex-col gap-4 mt-4">
          {expand && (
            <div className="flex flex-col gap-4">
              <div className="form-control">
                <input
                  className="input input-md w-full input-bordered input-primary"
                  placeholder="Street name"
                />
              </div>

              <div className="form-control">
                <input
                  className="input input-md w-full input-bordered input-primary"
                  placeholder="Street name"
                />
              </div>
            </div>
          )}
          <div
            className="btn btn-primary w-full btn-md"
            onClick={handleToggleExpand}
          >
            Add
          </div>
        </div>
      </div>
    </div>
  );
}
