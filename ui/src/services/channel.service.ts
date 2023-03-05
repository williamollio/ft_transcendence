import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";
import {
	channelUser,
  DBChannelElement,
  DBChannelUserListElement,
  user,
} from "../interfaces/chat.interfaces";

const PATH = "channels";
const USER_PATH = "users";
const BLOCK_PATH = "block";

class ChannelService {
  async getChannel(id: string): Promise<Response<DBChannelElement>> {
    return resolve<DBChannelElement>(
      axiosInstance.get(`${PATH}/${id}`).then((res: AxiosResponse) => res.data)
    );
  }

  async getUsersChannel(id: string): Promise<Response<Array<channelUser>>> {
    return resolve<Array<channelUser>>(
      axiosInstance.get(`${PATH}/get-users-of-a-channel/${id}`).then((res: AxiosResponse) => res.data)
    );
  }

  async getJoinedChannels(): Promise<Response<DBChannelElement[]>> {
    return resolve<DBChannelElement[]>(
      axiosInstance.get(`${PATH}/get-all-channels-by-user-id`).then((res: AxiosResponse) => res.data)
    );
  }

  async blockUser(id: string): Promise<Response<DBChannelUserListElement>> {
    return resolve<DBChannelUserListElement>(
      axiosInstance
        .post(`${BLOCK_PATH}/add-blocked-user`, {targetId: id})
        .then((res: AxiosResponse) => res.data)
    );
  }

  async unblockUser(id: string): Promise<Response<DBChannelUserListElement>> {
    return resolve<DBChannelUserListElement>(
      axiosInstance
        .post(`${BLOCK_PATH}/remove-blocked-user`, {targetId: id})
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getBlockedUsers(): Promise<Response<DBChannelUserListElement[]>> {
    return resolve<DBChannelUserListElement[]>(
      axiosInstance
        .get(`${BLOCK_PATH}/users-blocked-by-current-user`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getUserName(id: string): Promise<Response<user>> {
    return resolve<user>(
      axiosInstance
        .get(`${USER_PATH}/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getUserByName(name: string): Promise<Response<user>> {
    return resolve<user>(
      axiosInstance
        .get(`${USER_PATH}/byName/${name}`)
        .then((res: AxiosResponse) => res.data)
    );
  }
}
export default new ChannelService();
