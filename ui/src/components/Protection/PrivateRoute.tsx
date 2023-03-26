import React, { FC } from "react";
import {
  getIsAuthenticated,
  getTokenData,
  initAuthToken,
} from "../../utils/auth-helper";
import usersService from "../../services/users.service";
import { User } from "../../interfaces/user.interface";
import { AuthCheck } from "./AuthCheck";

export const PrivateRoute: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [isUserAuthorized, setIsUserAuthorized] =
    React.useState<boolean>(false);
  const [is2faRequired, setIs2faRequired] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const token = initAuthToken();
    if (token) {
      const userId = getTokenData(token).id;
      fetchCurrentUser(userId);
      if (!user?.secondFactorEnabled) {
        setIsUserAuthorized(true);
      } else if (user?.secondFactorEnabled && user?.secondFactorLogged) {
        setIs2faRequired(false);
      }
    }
  }, []);

  async function fetchCurrentUser(userId: string) {
    const responseUser = await usersService.getUser(userId);
    setUser(responseUser.data);
  }

  return (
    <AuthCheck
      isUserAuthorized={isUserAuthorized}
      is2faRequired={is2faRequired}
    >
      {children}
    </AuthCheck>
  );
};
