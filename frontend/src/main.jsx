import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#1e293b", color: "#e2e8f0" },
        }}
      />
      <App />
    </UserProvider>
  </BrowserRouter>,
);
