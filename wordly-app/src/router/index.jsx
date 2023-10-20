import * as React from "react";
import {
    createHashRouter,
} from "react-router-dom";
import AuthPage from "../pages/auth";
import DictionaryPage from "../pages/dictionary";
import PrivateRoute from "../utils/PrivateRoute";
import PublicRoute from "../utils/PublicRoute";
import CollectionsPage from "../pages/collections";
import CollectionPage from "../pages/collection";
import NotFoundPage from "../pages/not-found";

export const router = createHashRouter([
    {
        path: "/",
        element: <PrivateRoute component={<CollectionsPage />} />
    },
    {
        path: "*",
        element: <PrivateRoute component={<NotFoundPage />} />
    },
    {
        path: "/auth",
        element: <PublicRoute component={<AuthPage />} to='/dictionary' />
    },
    {
        path: "/dictionary",
        element: <PrivateRoute component={<DictionaryPage />} />
    },
    {
        path: "/collections",
        element: <PrivateRoute component={<CollectionsPage />} />
    },
    {
        path: "/collections/:id",
        element: <PrivateRoute component={<CollectionPage />} />
    }
]);