import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

console.log("Mounting React app...");

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("Root element not found: #root");
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
