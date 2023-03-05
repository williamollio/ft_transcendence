import { axiosInstance } from "../../../services/common/axios-instance";

export const BASE_PATH = "http://localhost:8080/";
export const USER_PATH = "users";

export async function fetchUserData(id: string) {
  const { data } = await axiosInstance.get(`${BASE_PATH}${USER_PATH}/${id}`);
  return data;
}
