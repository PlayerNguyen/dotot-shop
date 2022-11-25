import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import UserRequest from "../../requests/UserRequest";

export default function SignIn() {
  const [fields, setFields] = useState({ phoneOrEmail: "", password: "" });
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      navigate("/");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const { phoneOrEmail, password } = fields;
    UserRequest.postSignInUser({ phoneOrEmail, password }).then((response) => {
      console.log(response);
      const { token } = ResponseInterceptor.filterSuccess(response).data;

      localStorage.setItem(`token`, token);
      toast.success("Successfully sign in");
      navigate("/");
    });
  };

  return (
    <div className="signIn-wrapper">
      <form
        className="signIn mx-6 my-12 sm:mx-auto sm:w-2/3 md:w-1/3 lg:w-1/4 sm:my-40"
        onSubmit={handleSubmit}
      >
        <div className="text-5xl font-bold mb-12">Sign in</div>

        <div className="flex flex-col gap-5">
          {/* Email or phone number to login */}
          <div>
            {/* <label className="label">
            <span className="label-text">Email or phone number</span>
          </label> */}
            <input
              type="text"
              placeholder="Email or phone number"
              className="input input-bordered w-full"
              name="email"
              value={fields && fields.phoneOrEmail}
              required
              onChange={({ target }) => {
                setFields({ ...fields, phoneOrEmail: target.value });
              }}
            />
          </div>

          <div>
            {/* <label className="label">
            <span className="label-text">Password</span>
          </label> */}
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              name="password"
              value={fields && fields.password}
              required
              onChange={({ target }) => {
                setFields({ ...fields, password: target.value });
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div>
            <button
              className="btn btn-primary w-full"
              disabled={
                !(
                  fields &&
                  fields.password.length > 0 &&
                  fields.phoneOrEmail.length > 0
                )
              }
            >
              Sign in
            </button>
          </div>
          <div>
            <Link className="link text-zinc-400" to="/users/sign-up">
              I do not have an account yet
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
