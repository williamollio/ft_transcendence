import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./component/App";
import { BrowserRouter } from "react-router-dom";
import { TranscendanceProvider } from "./context/transcendance-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TranscendanceProvider>
        <App />
      </TranscendanceProvider>
    </BrowserRouter>
  </React.StrictMode>
);
