import React from "react";
import { Navigate, Route } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("auth");
  return <>{token ? <Route /> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;
