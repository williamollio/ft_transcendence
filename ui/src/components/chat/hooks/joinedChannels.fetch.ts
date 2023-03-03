import { axiosInstance } from "../../../services/common/axios-instance";
import { CHANNEL_PATH } from "./channelUsers.fetch";

export async function fetchJoinedChannels() {
  const { data } = await axiosInstance.get(
    `${CHANNEL_PATH}/get-all-channels-by-user-id`
  );
  return data;
}
