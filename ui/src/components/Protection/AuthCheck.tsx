import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";

interface AuthCheckProps {
  isUserAuthorized: boolean;
  is2faRequired: boolean;
  children: React.ReactElement;
}

export const AuthCheck: FC<AuthCheckProps> = ({
  isUserAuthorized,
  is2faRequired,
  children,
}) => {
  if (isUserAuthorized) {
    return children;
  } else if (is2faRequired) {
    return <Navigate to={RoutePath.LOGIN_2FA} replace />;
  } else {
    return <Navigate to={RoutePath.LOGIN} replace />;
  }
};
