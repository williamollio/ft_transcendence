import React, { FC } from "react";
import {
  Cookie,
  getIsAuthenticated,
  getTokenData,
  initAuthToken,
} from "../../utils/auth-helper";
import usersService from "../../services/users.service";
import { User } from "../../interfaces/user.interface";
import { AuthCheck } from "./AuthCheck";
import { CircularProgress } from "@mui/material";

export const PrivateRoute: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [isUserAuthorized, setIsUserAuthorized] =
    React.useState<boolean>(false);
  const [is2faRequired, setIs2faRequired] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [secondFactorEnabled, setSecondFactorEnabled] =
    React.useState<boolean>(true);
  const [secondFactorLogged, setSecondFactorLogged] =
    React.useState<boolean>(false);
  const [isUserDataLoaded, setIsUserDataLoaded] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const token = localStorage.getItem(Cookie.TOKEN);
    if (token) {
      const userId = getTokenData(token).id;
      fetchCurrentUser(userId);
    } else {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isUserDataLoaded && user) {
      if (!secondFactorEnabled || (secondFactorEnabled && secondFactorLogged)) {
        setIsUserAuthorized(true);
      }
      if (secondFactorEnabled && !secondFactorLogged) {
        setIs2faRequired(true);
      }
      setIsLoading(false);
    }
  }, [user]);

  async function fetchCurrentUser(userId: string) {
    const responseUser = await usersService.getUser(userId);
    setUser(responseUser.data);
    setSecondFactorLogged(responseUser.data.secondFactorLogged);
    setSecondFactorEnabled(responseUser.data.secondFactorEnabled);
    setIsUserDataLoaded(true);
  }

  return (
    <>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        <AuthCheck
          isUserAuthorized={isUserAuthorized}
          is2faRequired={is2faRequired}
        >
          {children}
        </AuthCheck>
      )}
    </>
  );
};
