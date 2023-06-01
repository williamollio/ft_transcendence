import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { TranscendanceProvider } from "./context/transcendance-context";
import { initReacti18n } from "./i18n/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize i18n
async function main() {
  if (typeof window !== "undefined") await initReacti18n();
}

main();
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <TranscendanceProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </TranscendanceProvider>
    </HashRouter>
  </React.StrictMode>
);
