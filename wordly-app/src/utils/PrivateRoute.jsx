import React from "react";
import { Navigate } from "react-router-dom";
import tokenService from "../services/tokenService";

const PrivateRoute = ({ component }) => {
    return (
        tokenService.isLoggenIn() ? component : <Navigate to="/auth" />
    );
}

export default PrivateRoute;