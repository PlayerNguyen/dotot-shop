import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="signUp-wrapper">
      <div className="signUp mx-6 my-12 sm:mx-auto sm:w-2/3 md:w-1/3 lg:w-1/4">
        <div className="font-bold text-3xl">Sign up</div>

        {/* First and last name field group */}
        <div className="flex flex-row gap-4">
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Email field group */}
        <div>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder=""
            className="input input-bordered w-full"
          />
        </div>

        {/* phone field group */}
        <div>
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            type="text"
            placeholder=""
            className="input input-bordered w-full"
          />
        </div>

        {/* Password field group */}
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
        {/* Re password group */}
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

        {/* Submit button */}
        <div className="flex flex-col mt-4 gap-4">
          <div>
            <button class="btn btn-primary w-full">Sign up</button>
          </div>
          <div className="flex-1">
            <Link to="/users/sign-in" className="link text-zinc-400">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
