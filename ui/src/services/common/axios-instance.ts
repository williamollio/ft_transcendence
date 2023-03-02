import { Cookie } from "../../utils/auth-helper";
import axios from "axios";
import { getBaseUrl } from "../../utils/url-helper";
import { eraseCookie } from "../../utils/auth-helper";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
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
