import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function RequestSignedIn() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      // Navigate to user route for sign up or sign in
      navigate(`/users`);
    }
  }, []);

  return <Outlet />;
}
