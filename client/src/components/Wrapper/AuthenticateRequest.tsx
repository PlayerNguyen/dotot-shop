import React from "react";
import { Outlet } from "react-router-dom";
import useRequestAuthenticate from "../../hooks/useRequestAuthenticate";
export default function AuthenticateRequest({ children }) {
  /**
   * Navigate to /users if the user was not signed in
   */
  useRequestAuthenticate("/users");

  /**
   * Otherwise, render an nested
   */
  return children;
}
