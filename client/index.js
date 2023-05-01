import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./src/App";

import { LanguageProvider } from "./src/context/LanguageContext";
import { SearchProvider } from "./src/context/SearchContext";
import { AuthStateProvider } from "./src/context/AuthStateContext";

const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <AuthStateProvider>
        <LanguageProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </LanguageProvider>
      </AuthStateProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
