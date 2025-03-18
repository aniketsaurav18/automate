import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { UserProvider } from "./providers/user-provider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="732216343045-lontkrlu3s2jm9tfu2gkjmcaaftpmio8.apps.googleusercontent.com">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <UserProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </UserProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
