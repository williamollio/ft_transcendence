import {resolve, Response} from "./common/resolve";
import {axiosInstance} from "./common/axios-instance";
import {AxiosResponse} from "axios";

const PATH = "auth";

class AuthService {
    async getAuthURI(): Promise<Response<String>> {
        return resolve<String>(
            axiosInstance.get(`${PATH}`).then((res: AxiosResponse) => res.data)
        );
    }
}

export default new AuthService();