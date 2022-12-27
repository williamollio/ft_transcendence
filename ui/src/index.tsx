import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./component/App";
import { BrowserRouter } from "react-router-dom";
import { TranscendanceProvider } from "./context/transcendance-context";
import { initReacti18n } from "./i18n/i18n";

// Initialize i18n
async function main() {
  if (typeof window !== "undefined") await initReacti18n();
}

main();
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
