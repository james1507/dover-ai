import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@core/locales/i18n';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "@core/store/store";
import ThemeProvider from "@shared/components/themes/ThemeProvider";
import { setupApp } from "@core/setupApp";

setupApp();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
