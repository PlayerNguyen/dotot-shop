import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      // Clear the token
      localStorage.removeItem(`token`);
    }

    navigate("/");
  }, []);
  return <div>Redirecting ...</div>;
}
