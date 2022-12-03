import axios from "axios";
import { getBaseUrl } from "../../utils/url-helper";

export const axiosInstance = axios.create({
  baseURL: `${getBaseUrl()}`,
});
