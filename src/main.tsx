import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@core/locales/i18n';
import { Provider } from "react-redux";
import { store } from "@core/store/store";
import ThemeProvider from "@shared/components/themes/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
