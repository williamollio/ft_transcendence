import React, { FC } from "react";
import { getIsAuthenticated } from "../utils/auth-helper";
import { Navigate } from "react-router-dom";
import { RoutePath } from "../interfaces/router.interface";

export const PrivateRoute: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const userIsLogged = getIsAuthenticated();

  if (!userIsLogged) {
    return <Navigate to={RoutePath.LOGIN} replace />;
  }
  return children;
};
