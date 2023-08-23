import React, { FC } from "react";
import { Cookie, getTokenData, initAuthToken } from "../../utils/auth-helper";
import usersService from "../../services/users.service";
import { User } from "../../interfaces/user.interface";
import { AuthCheck } from "./AuthCheck";
import { Box, CircularProgress } from "@mui/material";
import { RoutePath } from "../../interfaces/router.interface";

export const PrivateRoute: FC<{
  children: React.ReactElement;
  setToken: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ children, setToken }) => {
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
    let token;
    if (window.location.pathname === RoutePath.REDIRECT) {
      token = initAuthToken();
    } else {
      token = localStorage.getItem(Cookie.TOKEN);
    }
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
        setToken(true);
      }
      if (secondFactorEnabled && !secondFactorLogged) {
        setIs2faRequired(true);
      }
      setIsLoading(false);
    }
  }, [user]);

  async function fetchCurrentUser(userId: string) {
    const responseUser = await usersService.getUser(userId);
    if (!responseUser) {
      return null;
    }
    setUser(responseUser.data);
    setSecondFactorLogged(responseUser.data.secondFactorLogged);
    setSecondFactorEnabled(responseUser.data.secondFactorEnabled);
    setIsUserDataLoaded(true);
  }

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} />
        </Box>
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
