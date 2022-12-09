import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";
import { User, UserCreation } from "../interfaces/user.interface";

const PATH = "users";

class UsersService {
  async getUsers(): Promise<Response<User[]>> {
    return resolve<User[]>(
      axiosInstance.get(PATH).then((res: AxiosResponse) => res.data)
    );
  }

  async getUser(id: string): Promise<Response<User>> {
    return resolve<User>(
      axiosInstance.get(`PATH/${id}`).then((res: AxiosResponse) => res.data)
    );
  }

  async postUser(user: UserCreation): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance.post(PATH, user).then((res: AxiosResponse) => res.data)
    );
  }

  async patchUser(id: number, user: UserCreation): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .patch(`PATH/${id}`, user)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async deleteUser(id: number): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance.delete(`PATH/${id}`).then((res: AxiosResponse) => res.data)
    );
  }

  async firstAuthUser(id: number): Promise<Response<boolean>> {
    return resolve<boolean>(
      axiosInstance.post(`PATH/${id}`, 1).then((res: AxiosResponse) => res.data)
    );
  }

  async secondAuthUser(id: number, pin: string): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance.post(`PATH/${id}`, pin).then((res: AxiosResponse) => res.data)
    );
  }
}

export default new UsersService();
