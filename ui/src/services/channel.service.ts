import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";
import { DBChannelElement } from "../interfaces/chat.interfaces";

const PATH = "channels";

class ChannelService {
  async getChannel(id: string): Promise<Response<DBChannelElement>> {
    return resolve<DBChannelElement>(
      axiosInstance.get(`${PATH}/${id}`).then((res: AxiosResponse) => res.data)
    );
  }

  async getChannelUserList(id: string): Promise<Response<DBChannelElement>> {
    return resolve<DBChannelElement>(
      axiosInstance.get(`${PATH}/${id}`).then((res: AxiosResponse) => res.data)
    );
  }
}
export default new ChannelService();
