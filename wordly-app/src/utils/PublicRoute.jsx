import React from "react";
import { Navigate } from "react-router-dom";
import tokenService from "../services/tokenService";

const PublicRoute = ({ component, to }) => {
    return (
        tokenService.isLoggenIn() ? <Navigate to={to} /> : component
    );
}

export default PublicRoute;