import * as React from "react";
import {
    createHashRouter,
} from "react-router-dom";
import AuthPage from "../pages/auth";
import DictionaryPage from "../pages/dictionary";
import PrivateRoute from "../utils/PrivateRoute";
import PublicRoute from "../utils/PublicRoute";

export const router = createHashRouter([
    {
        path: "/",
        element: <PrivateRoute component={<DictionaryPage />} />
    },
    {
        path: "/auth",
        element: <PublicRoute component={<AuthPage />} to='/dictionary' />
    },
    {
        path: "/dictionary",
        element: <PrivateRoute component={<DictionaryPage />} />
    },
]);