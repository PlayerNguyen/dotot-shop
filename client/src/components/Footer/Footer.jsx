import React from "react";
import { Link } from "react-router-dom";
import { AiFillFacebook, AiFillPhone } from "react-icons/ai";

export default function Footer() {
  return (
    <div className="footer-wrapper bg-zinc-800 text-zinc-100">
      <footer className="footer p-12 min-h-[20vh] flex flex-col gap-4 sm:flex-row  md:mx-12">
        <div className="flex flex-col gap-1">
          {/* <div className="font-bold text-2xl">General</div> */}
          <Link to={`/contacts`} className={`font-bold text-xl`}>
            Contact
          </Link>
          <div className="flex flex-row gap-2">
            <span>
              <AiFillPhone />
            </span>
            <span className="text-zinc-400">(+84) 123456789</span>
          </div>
          {/* Social medias */}
          <div className="flex flex-row text-2xl my-1">
            <div>
              <AiFillFacebook />
            </div>
            <div>
              <AiFillFacebook />
            </div>
          </div>
          {/* <Link to={`/deliveries-policies`}>Delivery policies</Link> */}
        </div>

        <div>
          <div className="text-2xl font-bold">References</div>
          <div>Policies</div>
          <div>Exchange and Refurbish</div>
          <div>Warranty</div>
        </div>
      </footer>
    </div>
  );
}
