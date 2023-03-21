import React, { FC, useEffect } from "react";
import { getIsAuthenticated } from "../utils/auth-helper";
import { Navigate } from "react-router-dom";
import { RoutePath } from "../interfaces/router.interface";
import { SetState } from "zustand";

export const PrivateRoute: FC<{
  children: React.ReactElement;
  setToken: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ children, setToken }) => {
  const userIsLogged = getIsAuthenticated();

  useEffect(() => {
    if (userIsLogged) setToken(true);
  }, [userIsLogged]);

  if (!userIsLogged) {
    return <Navigate to={RoutePath.LOGIN} replace />;
  }
  return children;
};
