import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";
import { UserIds } from "../interfaces/user.interface";

const PATH = "friendship";

class FriendshipsService {
  async getNone(userId: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/none/${userId}`)
        .then((res: AxiosResponse) => res.data)
    );
  }
  async getRequestsReceived(userId: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/requests-received/${userId}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getRequests(userId: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/requests/${userId}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getAccepted(userId: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/accepted/${userId}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async postRequest(
    userId: string,
    friendIds: UserIds
  ): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .post(`${PATH}/request/${userId}`, friendIds)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async patchAccept(userId: string, friendId: string): Promise<Response<void>> {
    const friendshipDto = { id: friendId };
    return resolve<void>(
      axiosInstance
        .patch(`${PATH}/accept/${userId}`, friendshipDto)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async deleteRequest(
    userId: string,
    friendId: string
  ): Promise<Response<void>> {
    const friendshipDto = { id: friendId };
    return resolve<void>(
      axiosInstance
        .delete(`${PATH}/delete/${userId}`, { data: friendshipDto })
        .then((res: AxiosResponse) => res.data)
    );
  }
}
// eslint-disable-next-line
export default new FriendshipsService();
