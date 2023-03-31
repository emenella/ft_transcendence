import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App"
import Auth from "./routes/Auth";
import DoubleFA from "./routes/2FA";
import UsernameForm from "./components/form/UsernameForm";
import Error from "./components/Error";
import { getToken } from "./api/Api";

export const router = createBrowserRouter([
    {
        path: "/auth",
        element: <Auth />
    },
    {
        path: "/2fa",
        element: <DoubleFA />
    },
    {
        path: "/set-username",
        element: <UsernameForm />
    },
    {
        path: "/error",
        element: <Error />
    },
    {
        path: "/*",
        element: <App hasToken={getToken() !== null} />
    },
]);
