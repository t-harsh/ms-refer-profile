import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import App from "./App.jsx";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import { Provider, teamsTheme } from "@fluentui/react-northstar";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";

const msalInstance = new PublicClientApplication(msalConfig);


ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <Provider theme={teamsTheme} styles={{ backgroundColor: "#f5f5f5" }}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>

        </MsalProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
