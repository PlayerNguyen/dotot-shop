import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

export default function SellImageUpload({ visible, onSelect, onClose }) {
  const [cropValue, setCropValue] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [imageSource, setImageSource] = useState("");
  const [file, setFile] = useState();
  const inputRef = useRef();

  const handleOnSelectImage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCropValue(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageSource(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const handleOnImageLoad = (event) => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: `%`, width: 90 }, 1, width, height),
      width,
      height
    );

    setCropValue(crop);
  };

  useEffect(() => {
    return () => {
      setImageSource("");
      setFile(null);
      // console.log(inputRef.current.value);
    };
  }, []);

  return (
    visible && (
      <div className="wrapper bg-primary fixed w-full h-full top-0 left-0 bg-opacity-60">
        <div className="bg-base-200 w-full sm:w-2/3 mx-auto sm:my-4 sm:rounded-xl md:w-2/4 lg:w-2/5 xl:w-2/6 px-6 py-4">
          {/* Header */}
          <div className="flex flex-row items-center">
            <div className="flex-1">
              <b className="text-2xl">Title</b>
            </div>
            <button className="btn btn-ghost text-2xl" onClick={onClose}>
              <AiFillCloseCircle />
            </button>
          </div>

          <div className="divider"></div>

          {/* Body */}
          <div className="flex flex-col gap-4 max-h-[50vh] ">
            {/* Input file */}
            <div className="form-control">
              <input
                type="file"
                className="file-input w-full"
                onChange={handleOnSelectImage}
                ref={inputRef}
                accept="image/*"
              />
            </div>

            {/* Cropper */}
            {!!imageSource && (
              <ReactCrop
                crop={cropValue}
                onChange={(c, cropPercent) => {
                  setCropValue(cropPercent);
                }}
                className="w-1/3 sm:w-1/2 mx-auto"
                aspect={1}
              >
                <img
                  // className="max-h-[50vh]"
                  src={imageSource}
                  onLoad={handleOnImageLoad}
                />
              </ReactCrop>
            )}
          </div>

          <div className="divider"></div>

          {/* Footer */}
          <div className="flex flex-row-reverse gap-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                onSelect(cropValue, file);
                setImageSource("");
              }}
            >
              Select
            </button>
            <button className="btn btn-accent">Cancel</button>
          </div>
        </div>
      </div>
    )
  );
}
