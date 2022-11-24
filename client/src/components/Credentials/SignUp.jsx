import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import UserRequest from "../../requests/UserRequest";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    repassword: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [criteria, setCriteria] = useState({
    PasswordIsStrength: false,
    PasswordIsMatch: false,
  });

  useEffect(() => {
    const { password, repassword } = formData;
    setCriteria({
      ...criteria,
      PasswordIsMatch: password === repassword,
      PasswordIsStrength: password.length > 6,
    });
  }, [formData.password, formData.repassword]);

  /**
   * check whether the form is valid or not
   */
  const allCriteriaIsValid =
    criteria.PasswordIsMatch && criteria.PasswordIsStrength;

  /**
   * function to handle a submission of the form
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    UserRequest.postSignUpUser(formData)
      .then((_response) => {
        toast.success("Successfully create an account");
      })
      .catch((response) => {
        console.log(response);
        toast.error(ResponseInterceptor.filterError(response).message);
      });
  };

  return (
    <div className="signUp-wrapper">
      <form
        className="signUp mx-6 my-6 sm:mx-auto sm:w-2/3 md:w-1/3 lg:w-1/4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
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
              required
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
              required
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
            required
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
            required
          />
        </div>

        {/* Password field group */}
        <div>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={formData && formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            required
          />
          {!criteria.PasswordIsStrength &&
            !submitted &&
            formData.password.length > 0 && (
              <label className="label">
                <span className="label-text text-red-400">
                  Password must have greater than 5 characters
                </span>
              </label>
            )}
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
            required
          />
          {criteria && !submitted && !criteria.PasswordIsMatch && (
            <label className="label">
              <span className="label-text text-red-400">
                Password and repassword are not the same
              </span>
            </label>
          )}
        </div>

        {/* Submit button */}
        <div className="flex flex-col mt-4 gap-4">
          <div>
            <button
              className="btn bg-green-700 hover:bg-green-800 w-full text-white font-bold"
              disabled={!allCriteriaIsValid}
            >
              Create account
            </button>
          </div>
          <div className="flex-1">
            <Link to="/users/sign-in" className="link text-zinc-400">
              Already have an account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
