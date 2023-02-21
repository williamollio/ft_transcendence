import { Cookie } from "../../utils/auth-helper";
import axios from "axios";
import { getBaseUrl } from "../../utils/url-helper";

export const axiosInstance = axios.create({
  baseURL: `${getBaseUrl()}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(Cookie.TOKEN)}`,
  },
});
