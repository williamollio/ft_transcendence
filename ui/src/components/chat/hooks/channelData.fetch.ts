import { axiosInstance } from "../../../services/common/axios-instance";
import { CHANNEL_PATH } from "./channelUsers.fetch";
import { BASE_PATH } from "./userData.fetch";

export async function fetchChannelData(id: string | undefined) {
  const { data } = await axiosInstance.get(`${BASE_PATH}${CHANNEL_PATH}/${id}`);
  return data;
}
