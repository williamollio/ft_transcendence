import { LOCAL_STORAGE_KEY } from "./localstorage-helper";
export enum Cookie {
  TOKEN = "access_token",
}

interface tokenData {
  name: string;
  id: number;
}

export function initAuthToken(): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${Cookie.TOKEN}=`);
  if (parts.length === 2) {
    const token = parts.pop()?.split(";").shift();
    if (token === undefined) {
      return null;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
    return token;
  } else {
    return null;
  }
}

export function getTokenData(token: string): tokenData {
  const tokenParts = token.split(".");
  const tokenPayload = JSON.parse(atob(tokenParts[1]));
  return {
    name: tokenPayload.name,
    id: tokenPayload.id,
  };
}
