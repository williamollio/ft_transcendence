import {Cookie, extractRefreshToken, initAuthToken, initAuthTokenAsync} from "../../utils/auth-helper";
import axios from "axios";
import { getBaseUrl } from "../../utils/url-helper";
import { eraseCookie } from "../../utils/auth-helper";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import authService from "../auth.service";

let access_token = "";

export const axiosInstance = axios.create({
  baseURL: `${getBaseUrl()}`,
});

export const refreshAxios = axios.create({
  baseURL: `${getBaseUrl()}`,
});

refreshAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem(Cookie.REFRESH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(Cookie.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken() {
  try {
    // TODO: Somehow store the new tokens
    const tokens = (await authService.refreshToken()).data;
    localStorage.setItem(Cookie.TOKEN, tokens.accessToken);
    localStorage.setItem(Cookie.REFRESH_TOKEN, tokens.refreshToken);
    access_token = tokens.accessToken;
    console.log("access_token: " + access_token);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        console.log("initial token " + localStorage.getItem(Cookie.TOKEN));
        return refreshAccessToken().then(() => {
          originalConfig.headers.Authorization = `Bearer ${access_token}`;
          return axiosInstance(originalConfig);
        });
      } catch (_error) {
        return Promise.reject(_error);
      }
    } /*else if (error.response.status === 401 && originalConfig._retry) {
      const token = localStorage.getItem(Cookie.TOKEN);
      if (token) {
        localStorage.removeItem(Cookie.TOKEN);
        eraseCookie(Cookie.TOKEN);
        eraseCookie(Cookie.REFRESH_TOKEN);
      }
      const navigate = useNavigate();
      navigate(RoutePath.LOGIN);
    }*/
    return Promise.reject(error);
  }
);
