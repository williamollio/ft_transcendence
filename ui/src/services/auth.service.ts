import { getBaseUrlServer } from "../utils/url-helper";
import { axiosInstance } from "./common/axios-instance";
import { resolve, Response } from "./common/resolve";
import { AxiosResponse } from "axios";

const PATH = "auth";

class AuthService {
  getAuth42URI(): string {
    return `${getBaseUrlServer()}auth/intra42`;
  }

  getAuthGoogleURI(): string {
    return `${getBaseUrlServer()}auth/google`;
  }

  async sendSecondFactor(code: string[]): Promise<Response<void>> {
    const newString: string = code
      .map((value) => {
        return value;
      })
      .join("");
    return resolve<void>(
      axiosInstance
        .post(`${getBaseUrlServer()}auth/2fa/validate`, { code: newString })
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
