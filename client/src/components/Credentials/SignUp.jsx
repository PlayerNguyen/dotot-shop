import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    repassword: "",
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="signUp-wrapper">
      <div className="signUp mx-6 my-6 sm:mx-auto sm:w-2/3 md:w-1/3 lg:w-1/4 flex flex-col gap-4">
        <div className="font-bold text-4xl mb-4">Sign up</div>

        {/* First and last name field group */}
        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1">
            {/* <label className="label">
              <span className="label-text">First Name</span>
            </label> */}
            <input
              type="text"
              placeholder="First name"
              className="input input-bordered w-full"
              value={formData && formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
              }}
            />
          </div>

          <div className="flex-1">
            {/* <label className="label">
              <span className="label-text">Last Name</span>
            </label> */}
            <input
              type="text"
              placeholder="Last name"
              className="input input-bordered w-full"
              value={formData && formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
              }}
            />
          </div>
        </div>

        {/* Email field group */}
        <div>
          {/* <label className="label">
            <span className="label-text">Email</span>
          </label> */}
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData && formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
        </div>

        {/* phone field group */}
        <div>
          {/* <label className="label">
            <span className="label-text">Phone</span>
          </label> */}
          <input
            type="text"
            placeholder="Phone number"
            className="input input-bordered w-full"
            value={formData && formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
            }}
          />
        </div>

        {/* Password field group */}
        <div>
          {/* <label className="label">
            <span className="label-text">Password</span>
          </label> */}
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={formData && formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
        </div>
        {/* Re password group */}
        <div>
          {/* <label className="label">
            <span className="label-text">Confirm password</span>
          </label> */}
          <input
            type="password"
            placeholder="Confirm password"
            className="input input-bordered w-full"
            value={formData && formData.repassword}
            onChange={(e) => {
              setFormData({ ...formData, repassword: e.target.value });
            }}
          />
        </div>

        {/* Submit button */}
        <div className="flex flex-col mt-4 gap-4">
          <div>
            <button class="btn bg-green-700 hover:bg-green-800 w-full text-white font-bold">
              Sign up
            </button>
          </div>
          <div className="flex-1">
            <Link to="/users/sign-in" className="link text-zinc-400">
              Already have an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
