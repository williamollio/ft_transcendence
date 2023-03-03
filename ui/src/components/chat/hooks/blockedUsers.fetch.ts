import { axiosInstance } from "../../../services/common/axios-instance";
import { BASE_PATH } from "./userData.fetch";

export const BLOCK_PATH = "block";

export async function fetchBlockedUsers() {
  const { data } = await axiosInstance.get(`${BASE_PATH}${BLOCK_PATH}/users-blocked-by-current-user`);
  return data;
}
