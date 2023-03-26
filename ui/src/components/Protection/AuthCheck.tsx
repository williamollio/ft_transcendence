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
    if (is2faRequired) {
      return <Navigate to={RoutePath.LOGIN_2FA} replace />;
    } else {
      return children;
    }
  } else {
    return <Navigate to={RoutePath.LOGIN} replace />;
  }
};

// return isUserAuthorized ? (
//     children ? (
//       is2faRequired
//     ) : (
//       <Navigate to={RoutePath.LOGIN_2FA} replace />
//     )
//   ) : (
//     <Navigate to={RoutePath.LOGIN} replace />
//   );
