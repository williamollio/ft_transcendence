import React from "react";
import { RoutePath } from "../../interfaces/router.interface";
import { Navigate } from "react-router-dom";
import authService from "../../services/auth.service";

export default function LoginCallback(): React.ReactElement {
  const getToken: (query: string) => any = (query: string) => {
    const params = new URLSearchParams(query);
    return Object.fromEntries(params);
  };

  const stateMatch: (state: any) => boolean = (state: any) => {
    return state && authService.checkState(state);
  };

  let success = false;
  const payload = getToken(window.location.search.split("?")[1]);

  if (payload.error || !payload.code || !stateMatch(payload.state)) {
    alert(
      "OAuth failed!" + (payload.error ? "\nReason: " + payload.error : "")
    );
  } else {
    success = true;
    // TODO: Send code to BE, await JWT
  }

  return <Navigate to={success ? RoutePath.PROFILE : RoutePath.LOGIN} />;
}
