import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";
import { User } from "../interfaces/user.interface";

const PATH = "friendship";

interface UserIds {
  id: string;
}

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
  async getRequestsReceived(id: string): Promise<Response<Friendship[]>> {
    return resolve<Friendship[]>(
      axiosInstance
        .get(`${PATH}/requests-received/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getRequests(id: string): Promise<Response<Friendship[]>> {
    return resolve<Friendship[]>(
      axiosInstance
        .get(`${PATH}/requests/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async getAccepted(id: string): Promise<Response<Friendship[]>> {
    return resolve<Friendship[]>(
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

  async patchAccept(id: string, userIds: UserIds): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .patch(`${PATH}/accept/${id}`, userIds)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async patchDeny(id: string, userIds: UserIds): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .patch(`${PATH}/deny/${id}`, userIds)
        .then((res: AxiosResponse) => res.data)
    );
  }
}
// eslint-disable-next-line
export default new FriendshipsService();
