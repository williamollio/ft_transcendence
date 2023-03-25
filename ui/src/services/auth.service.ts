import { getBaseUrl } from "../utils/url-helper";
import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";

const PATH = "auth";

class AuthService {
  getAuthURI(): string {
    return `${getBaseUrl()}auth/intra42`;
  }

  async sendSecondFactor(code: string[]): Promise<Response<void>> {
    let c = "";
    for (const codePart in code) {
      c.concat(codePart);
    }
    return resolve<void>(
      axiosInstance
        .post(`${getBaseUrl()}auth/2fa/validate`, c)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async activateSecondFactor(): Promise<Response<string>> {
    // returns QR Code
    return resolve<string>(
      axiosInstance
        .get(`${PATH}/2fa/activate`)
        .then((res: AxiosResponse) => res.data)
    );
  }

  async disableSecondFactor(): Promise<Response<void>> {
    return resolve<void>(
      axiosInstance
        .post(`${PATH}/2fa/disable`)
        .then((res: AxiosResponse) => res.data)
    );
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();
