import { axiosInstance } from "../../../services/common/axios-instance";

export const CHANNEL_PATH = "channels";

export async function fetchUsersOfChannel(id: string) {
  const { data } = await axiosInstance.get(
    `${CHANNEL_PATH}/get-users-of-a-channel/${id}`
  );
  return data;
}
