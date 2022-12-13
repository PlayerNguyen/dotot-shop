import React, { Suspense } from "react";
import client from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
const appElement = document.getElementById("app");
let root = client.createRoot(appElement);
import { Provider } from "react-redux";
import { store } from "./stores/globalStore";

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
