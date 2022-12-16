import React from "react";
import {
  AiFillFacebook,
  AiFillGoogleCircle,
  AiFillPhone,
} from "react-icons/ai";

export default function Footer() {
  return (
    <div className="footer-wrapper bg-neutral-focus text-primary-content md:px-12">
      <footer className="footer p-12 min-h-[20vh] flex flex-col gap-4 sm:flex-row  sm:gap-10">
        <div className="flex flex-col gap-2 flex-1">
          {/* <div className="font-bold text-2xl">General</div> */}
          <div className={`text-base-content font-bold text-2xl`}>Contact</div>

          <div>
            <div className="flex flex-row gap-2">
              <span>
                <AiFillPhone />
              </span>
              <span>(+84) 123456789</span>
            </div>

            <div className="flex flex-row gap-2">
              <span>
                <AiFillPhone />
              </span>
              <span>(+84) 123456789</span>
            </div>
          </div>

          {/* Social medias */}
          <div className="flex flex-row text-3xl my-1 gap-2">
            <div>
              <AiFillFacebook />
            </div>
            <div>
              <AiFillGoogleCircle />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-2xl font-bold text-base-content">References</div>
          <div className="text-primary-content flex flex-col gap-2">
            <div>Policies</div>
            <div>Exchange and Refurbish</div>
            <div>Warranty</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
