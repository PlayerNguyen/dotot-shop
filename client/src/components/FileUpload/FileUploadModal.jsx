import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import UserRequest from "../../requests/UserRequest";

export default function FileUploadModal({
  visible,
  onCloseClick,
  onCancel,
  onComplete,
  title,
}) {
  const inputRef = useRef(null);
  const [imageSource, setImageSource] = useState(null);
  const [files, setFiles] = useState(null);
  const [crop, setCrop] = useState();
  const [imageSize, setImageSize] = useState({ width: -1, height: -1 });
  const [posting, setPosting] = useState(false);

  /**
   *
   * @param {import("react").ChangeEvent} e
   */
  const handleSelectImage = (e) => {
    const { files } = e.target;

    if (files && files.length > 0) {
      // if file is not an image, send an error to interface
      if (!files[0].type.includes("image")) {
        toast.error("File must be an image");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.addEventListener("load", (e) => {
        setImageSource(reader.result);
        setFiles(files);

        // Capture image actual size
        var imageObject = new Image();
        imageObject.addEventListener("load", (e) => {
          const { width, height } = imageObject;
          setImageSize({
            width,
            height,
          });
        });
        imageObject.src = reader.result;
      });
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    // Capture crop
    const crop = centerCrop(
      makeAspectCrop(
        {
          // You don't need to pass a complete crop into
          // makeAspectCrop or centerCrop.
          unit: "%",
          width: 90,
        },
        1, // aspect
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  useEffect(() => {
    return () => cleanUpComponent();
  }, []);

  const cleanUpComponent = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = null;
    }

    setImageSource(null);
    setCrop(null);
  };

  const handleUploadFile = () => {
    setPosting(true);
    let form = new FormData();
    const { x, y, width, height } = crop;
    const actualX = Math.ceil((x / 100) * imageSize.width);
    const actualY = Math.ceil((y / 100) * imageSize.height);
    const actualInnerBoxWidth = Math.ceil((width / 100) * imageSize.width);
    const actualInnerBoxHeight = Math.ceil((height / 100) * imageSize.height);
    // console.log(crop, {
    //   x: actualX,
    //   y: actualY,
    //   width: actualInnerBoxHeight,
    //   height: actualInnerBoxHeight,
    // });

    form.append("avatar", files[0]);
    form.append("fromX", actualX);
    form.append("fromY", actualY);
    form.append("width", actualInnerBoxWidth);
    form.append("height", actualInnerBoxHeight);

    // Post and then success
    UserRequest.postChangeUserAvatar(form)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        onComplete(data);
        cleanUpComponent();
      })
      .catch((response) => {
        const { message } = ResponseInterceptor.filterError(response);
        toast.error(message);
      })
      .finally(() => setPosting(false));
  };

  return visible ? (
    <div className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-70">
      <div className="block sm:w-4/5 md:w-2/3 lg:w-1/3 mx-auto sm:mt-[10vh]">
        <div className="mx-auto w-full bg-white sm:block sm:rounded-xl sm:top-[20vh] p-6  overflow-y-scroll">
          {/* Header */}
          <div className="flex flex-row items-center">
            {/* Title */}
            <div className="flex-1 font-bold text-2xl">{title && title}</div>
            {/* Close button */}
            <button className="btn btn-ghost text-2xl" onClick={onCloseClick}>
              <AiOutlineCloseCircle />
            </button>
          </div>

          {/* Body */}
          <div className="block">
            <div className="flex flex-col gap-3">
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleSelectImage}
                multiple={false}
                ref={inputRef}
                accept="image/*"
              />

              {/* Review crop */}
              <div className="mx-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(_crop, percentCrop) => {
                    // console.log(_crop, percentCrop);
                    setCrop(percentCrop);
                  }}
                  aspect={1}
                >
                  <img
                    className="!max-h-[60vh] sm:!max-h-[50vh]"
                    src={imageSource}
                    onLoad={handleImageLoad}
                  />
                </ReactCrop>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-4">
            <div className="flex flex-row-reverse gap-4">
              <button
                className={`${
                  posting ? `btn btn-disabled loading` : `btn btn-primary`
                }`}
                onClick={handleUploadFile}
                disabled={!imageSource}
              >
                Use
              </button>
              <button className="btn btn-accent" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
