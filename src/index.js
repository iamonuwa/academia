import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import App from "./pages/App";
import ThemeProvider, { GlobalStyle } from "./theme";
import StorageProvider, {
  Updater as StorageUpdater
} from "./contexts/LocalStorage.context";
import AppContextProvider from "./contexts/App.context";

import * as serviceWorker from "./serviceWorker";

const Updaters = () => (
  <>
    <StorageUpdater />
  </>
);

const ContextProviders = ({ children }) => (
  <>
    <StorageProvider>
      <AppContextProvider>
        <ToastProvider autoDismissTimeout={6000}>{children}</ToastProvider>	
      </AppContextProvider>
    </StorageProvider>
  </>
);

ReactDOM.render(
  <ContextProviders>
    <Updaters />
    <ThemeProvider>
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </ContextProviders>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
