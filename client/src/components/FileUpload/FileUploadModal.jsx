import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function FileUploadModal({ visible }) {
  const inputRef = useRef(null);
  const [imageSource, setImageSource] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  /**
   *
   * @param {import("react").ChangeEvent} e
   */
  const handleSelectImage = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.addEventListener("load", (e) => {
        console.log(reader);
        setImageSource(reader.result);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (inputRef && inputRef.current) {
        inputRef.current.value = null;
      }
    };
  }, []);

  const handleUploadFile = () => {
    let form = new FormData();
  };

  return visible ? (
    <div className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-70">
      <div className="mx-auto w-full sm:w-1/6 bg-white absolute sm:top-[20vh] p-6">
        {/* Header */}
        <div className="flex flex-row items-center">
          {/* Title */}
          <div className="flex-1 font-bold text-2xl">Modal title</div>
          {/* Close button */}
          <button className="btn btn-ghost text-2xl">
            <AiOutlineCloseCircle />
          </button>
        </div>

        {/* Body */}
        <div className="">
          <div className="flex flex-col gap-3">
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={handleSelectImage}
              multiple={false}
              ref={inputRef}
            />

            <ReactCrop
              crop={crop}
              onChange={(_crop, percentCrop) => {
                console.log(percentCrop);
                setCrop(percentCrop);
              }}
              aspect={1}
            >
              <img src={imageSource} />
            </ReactCrop>
          </div>
        </div>
        {/* Footer */}
        <div>
          <div className="flex flex-row-reverse gap-4">
            <button className="btn btn-primary">Use</button>
            <button className="btn btn-accent">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
