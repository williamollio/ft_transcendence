import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";
import { UserIds } from "../interfaces/user.interface";

const PATH = "friendship";

interface Friendship {
  requesterId: string;
  addresseId: string;
}

class FriendshipsService {
  async getNone(id: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/none/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }
  async getRequestsReceived(id: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/requests-received/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getRequests(id: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/requests/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getAccepted(id: string): Promise<Response<UserIds[]>> {
    return resolve<UserIds[]>(
      axiosInstance
        .get(`${PATH}/accepted/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async postRequest(id: string, userIds: UserIds): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .post(`${PATH}/request/${id}`, userIds)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async patchAccept(id: string, userId: string): Promise<Response<void>> {
    const friendshipDto = { id: userId };
    return resolve<void>(
      axiosInstance
        .patch(`${PATH}/accept/${id}`, friendshipDto)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async deleteRequest(id: string, userId: string): Promise<Response<void>> {
    const friendshipDto = { id: userId };
    return resolve<void>(
      axiosInstance
        .delete(`${PATH}/delete/${id}`, { data: friendshipDto })
        .then((res: AxiosResponse) => res.data)
    );
  }
}
// eslint-disable-next-line
export default new FriendshipsService();
