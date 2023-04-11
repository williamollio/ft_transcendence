import { Cookie, initAuthTokenAsync } from "../../utils/auth-helper";
import axios from "axios";
import { getBaseUrl } from "../../utils/url-helper";
import { eraseCookie } from "../../utils/auth-helper";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import authService from "../auth.service";

export const axiosInstance = axios.create({
  baseURL: `${getBaseUrl()}`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(Cookie.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        console.log("initial token " + localStorage.getItem(Cookie.TOKEN));
        await authService.refreshToken();
        const token = await initAuthTokenAsync();

        if (token) {
          console.log("updated token " + token);
          axiosInstance.defaults.headers.common["Authorization"] =
            "Bearer " + token;
        }

        return axiosInstance(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    } else if (error.response.status === 401 && originalConfig._retry) {
      const token = localStorage.getItem(Cookie.TOKEN);
      if (token) {
        localStorage.removeItem(Cookie.TOKEN);
        eraseCookie(Cookie.TOKEN);
        eraseCookie(Cookie.REFRESH_TOKEN);
      }
      const navigate = useNavigate();
      navigate(RoutePath.LOGIN);
    }
    return Promise.reject(error);
  }
);
