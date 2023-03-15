import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";
import { User } from "../interfaces/user.interface";

const PATH = "users";

class UsersService {
  async getUsers(): Promise<Response<User[]>> {
    return resolve<User[]>(
      axiosInstance.get(PATH).then((res: AxiosResponse) => res.data)
    );
  }

  async getUser(id: string): Promise<Response<User>> {
    return resolve<User>(
      axiosInstance.get(`${PATH}/${id}`).then((res: AxiosResponse) => res.data)
    );
  }

  async postUserImage(file: any, userId: string): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .post(`${PATH}/upload/${userId}`, file)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async patchUser(id: string, userName: string): Promise<Response<void>> {
    const userDto = { name: userName };
    return resolve<void>(
      axiosInstance
        .patch(`${PATH}/${id}`, userDto)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async deleteUser(id: string): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .delete(`${PATH}/${id}`)
        .then((res: AxiosResponse) => res.data)
    );
  }
}
// eslint-disable-next-line
export default new UsersService();
