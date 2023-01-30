import { getBaseUrl } from "../utils/url-helper";

class AuthService {
  getAuthURI(): string {
    return `${getBaseUrl()}auth/intra42`;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();
