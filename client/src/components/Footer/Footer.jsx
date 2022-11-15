import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer-wrapper bg-zinc-800 text-zinc-100">
      <footer className="footer p-12 min-h-[20vh] flex flex-row">
        <div>
          {/* <div className="font-bold text-2xl">General</div> */}
          <Link to={`/contacts`}>Contact</Link>
          <Link to={`/deliveries-policies`}>Delivery policies</Link>
        </div>
        <div>
          <div>Hi</div>
        </div>
      </footer>
    </div>
  );
}
