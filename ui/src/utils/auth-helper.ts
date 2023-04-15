import {LOCAL_STORAGE_KEY} from "./localstorage-helper";

export enum Cookie {
  TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

interface tokenData {
  name: string;
  id: string;
}

export function extractRefreshToken(): string | null {
  const cookies = document.cookie;
  const begin = cookies.indexOf(Cookie.REFRESH_TOKEN);
  if (begin < 0) {
    return null;
  }
  const end = cookies.indexOf(';', begin);
  return cookies.substring(cookies.indexOf('=', begin) + 1, end === -1 ? undefined : end);
}

export function initRefreshToken(): string | null {
  const token = extractRefreshToken();
  if (token) {
    localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, token);
  }
  return token;
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

export async function initAuthTokenAsync(): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    setTimeout(() => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${Cookie.TOKEN}=`);
      if (parts.length === 2) {
        const token = parts.pop()?.split(";").shift();
        if (token === undefined) {
          resolve(null);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
          resolve(token);
        }
      } else {
        resolve(null);
      }
    }, 1000);
  });
}

export function getTokenData(token: string): tokenData {
  const tokenParts = token.split(".");
  const tokenPayload = JSON.parse(atob(tokenParts[1]));
  return {
    name: tokenPayload.name,
    id: tokenPayload.id,
  };
}

export const getIsAuthenticated = () => {
  const token = localStorage.getItem(Cookie.TOKEN);
  if (token !== null) {
    return true;
  } else {
    let token = initAuthToken();
    if (token === null) {
      return false;
    }
  }
};

export function eraseCookie(name: string) {
  document.cookie = name + "=; Max-Age=-99999999;";
}
