import React, { useState } from "react";
import {
  CgChevronDownO,
  CgChevronLeftO,
  CgClose,
  CgCloseO,
} from "react-icons/cg";

function ImageContainer({ visible, onToggle }) {
  return (
    <div className="flex flex-col gap-4 ">
      {/* Toggle expand */}
      <div
        className="flex flex-row items-center gap-2 hover:bg-zinc-100 rounded-xl px-3 py-2 cursor-pointer"
        onClick={onToggle}
      >
        <b className="text-xl flex-1">Image</b>
        <div>{visible ? <CgChevronDownO /> : <CgChevronLeftO />}</div>
      </div>
      {/*  */}
      {visible && (
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <div className="carousel w-full">
              <div id="slide1" className="carousel-item relative w-full">
                <img
                  src="http://localhost:3000/default.png"
                  className="w-full"
                />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a href="#slide4" className="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide2" className="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
              <div id="slide2" className="carousel-item relative w-full">
                <img
                  src="http://localhost:3000/default.png"
                  className="w-full"
                />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a href="#slide1" className="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide3" className="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
              <div id="slide3" className="carousel-item relative w-full">
                <img
                  src="http://localhost:3000/default.png"
                  className="w-full"
                />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a href="#slide2" className="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide4" className="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
              <div id="slide4" className="carousel-item relative w-full">
                <img
                  src="http://localhost:3000/default.png"
                  className="w-full"
                />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a href="#slide3" className="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide1" className="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <input
              className="file-input file-input-bordered w-full file-input-sm"
              type={`file`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoContainer({ visible, onToggle }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Expandable */}
      <div
        className="flex flex-row items-center gap-2 hover:bg-zinc-100 rounded-xl px-3 py-2 cursor-pointer"
        onClick={onToggle}
      >
        <b className="text-xl flex-1">Info</b>
        <div>{visible ? <CgChevronDownO /> : <CgChevronLeftO />}</div>
      </div>

      {/* Container */}
      {visible && (
        <div className="flex flex-col gap-4 px-4">
          <div>
            <input
              className="input input-sm w-full input-primary"
              placeholder={`Products' name`}
            />
          </div>

          <div>
            <textarea
              className="textarea textarea-sm w-full textarea-primary"
              placeholder={`Products' description`}
            ></textarea>
          </div>

          <div>
            <input
              type="number"
              className="input input-sm w-full input-primary"
              min={"0"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductEditModal({ visible, onClose, onCancel }) {
  const [visibleImageContainer, setVisibleImageContainer] = useState(false);
  const [visibleInfoContainer, setVisibleInfoContainer] = useState(false);

  const [anyChange, setAnyChange] = useState(false);

  const handleToggleVisibleImageContainer = () => {
    setVisibleImageContainer((prev) => !prev);
  };

  const handleToggleVisibleInfoContainer = () => {
    setVisibleInfoContainer((prev) => !prev);
  };
  return (
    visible && (
      <div className="adminProductEditModal-wrapper bg-black bg-opacity-70 w-full h-full fixed top-0 left-0">
        {/* container form */}
        <div className="w-full sm:mt-12 mx-auto sm:rounded-xl sm:w-4/5 md:w-1/3 bg-base-200 px-6 py-4 flex flex-col">
          {/* header */}
          <div className="flex flex-row items-center text-xl font-bold">
            <div className="flex-1">Edit product</div>
            {/* close btn */}
            <div>
              <button className="btn btn-ghost text-xl">
                <CgCloseO />
              </button>
            </div>
          </div>
          <div className="divider"></div>
          {/* body, vh-80 */}
          <div className=" max-h-[80vh] sm:max-h-[60vh] overflow-y-auto flex flex-col gap-4">
            {/* Image section */}
            <ImageContainer
              visible={visibleImageContainer}
              onToggle={handleToggleVisibleImageContainer}
            />

            {/* Info container */}
            <InfoContainer
              visible={visibleInfoContainer}
              onToggle={handleToggleVisibleInfoContainer}
            />
          </div>

          <div className="divider"></div>

          {/* footer with buttons */}
          <div className="flex flex-row-reverse gap-4">
            <button className="btn btn-accent">Cancel</button>
            <button className="btn btn-primary" disabled={!anyChange}>
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
}
