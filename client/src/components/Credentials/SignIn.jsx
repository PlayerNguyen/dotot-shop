import React from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div className="signIn-wrapper">
      <div className="signIn mx-6 my-12 sm:mx-auto sm:w-2/3 md:w-1/3 lg:w-1/4 sm:my-40">
        <div className="text-3xl font-bold">Sign in</div>

        {/* Email or phone number to login */}
        <div>
          <label className="label">
            <span className="label-text">Email or phone number</span>
          </label>
          <input
            type="text"
            placeholder=""
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder=""
            className="input input-bordered w-full"
          />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div>
            <button className="btn btn-primary w-full">Sign in</button>
          </div>
          <div>
            <Link className="link text-zinc-400" to="/users/sign-up">
              I do not have an account yet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
