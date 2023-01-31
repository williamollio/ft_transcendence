import { LOCAL_STORAGE_KEY } from "./localstorage-helper";
enum Cookie {
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
