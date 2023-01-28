import React from "react";
import { RoutePath } from "../../interfaces/router.interface";
// @ts-ignore
import { Redirect } from "react-router-dom";
import authService from "../../services/auth.service";

type OAuthResult = {
  token: string | null;
  state: string | null;
  error: string | null;
};

export default function LoginCallback(): React.ReactElement {
  const getToken: (query: string) => OAuthResult = (query: string) => {
    const args = query.split("&");

    let token = null,
      state = null,
      error = null;

    for (const arg in args) {
      if (arg === "state") {
        state = arg;
      } else if (arg === "code???") {
        token = arg;
      } else if (arg === "error???") {
        error = arg;
      }
    }

    return { token: token, state: state, error: error };
  };

  const stateMatch: (state: any) => boolean = (state: any) => {
    return state && authService.checkState(state);
  };

  let success = false;
  const payload = getToken(window.location.search.split("?")[1]);

  if (payload.error || !payload.token || !stateMatch(payload.state)) {
    alert("OAuth failed!");
  } else {
    success = true;
    // TODO: Send token to BE, await JWT
  }

  return <Redirect to={success ? RoutePath.PROFILE : RoutePath.LOGIN} />;
}
