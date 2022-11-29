import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ProfileGeneral() {
  const [profile] = useOutletContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState(profile.phone);

  // useEffect(() => {

  // })

  function handleChangePasswordSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="mx-3 flex flex-col gap-4 w-full">
      <div className="text-3xl font-bold">General</div>
      <div className="flex flex-row">
        <div className="sm:w-1/3"></div>
        <div className="flex flex-col gap-3 w-full sm:w-2/3">
          {/* Name */}
          <div className="form-control w-full max-w-xs flex flex-row gap-3">
            <input
              type="text"
              value={profile && profile.firstName}
              className="input input-bordered w-full max-w-xs"
              disabled
            />
            <input
              type="text"
              value={profile && profile.lastName}
              className="input input-bordered w-full max-w-xs"
              disabled
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Email"
              value={profile && profile.email}
              className="input input-bordered w-full max-w-xs"
              disabled
            />
          </div>
        </div>
      </div>

      {/* <div className="text-3xl font-bold">Update</div> */}
      <div className="flex flex-row">
        <div className="sm:w-1/3"></div>
        <form
          className="flex flex-col gap-3 w-full sm:w-2/3"
          onSubmit={handleChangePasswordSubmit}
        >
          <div className="form-control w-full max-w-xs flex flex-col gap-3">
            <input
              type="password"
              placeholder="Enter Password to change"
              className="input input-bordered w-full max-w-xs"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
            />
            {currentPassword.length > 0 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  className="input input-bordered w-full max-w-xs"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input input-bordered w-full max-w-xs"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary max-w-sm mt-2"
                  disabled={
                    !(
                      password.length > 0 &&
                      confirmPassword.length > 0 &&
                      password === confirmPassword
                    )
                  }
                >
                  Change password
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      <div className="flex flex-row">
        <div className="sm:w-1/3"></div>
        <div className="flex flex-col gap-3 w-full sm:w-2/3">
          <div className="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Phone number"
              className="input input-bordered w-full max-w-xs"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            {profile && profile.phone !== phone && (
              <button className="btn btn-primary max-w-xs mt-2">
                Update phone number
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
