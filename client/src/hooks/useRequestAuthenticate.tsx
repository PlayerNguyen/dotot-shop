import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useRequestAuthenticate(path: string) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate(path);
    }
  });
}
