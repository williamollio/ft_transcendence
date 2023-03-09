import { axiosInstance } from "./common/axios-instance";

const PATH = "/users";

class StatsService {
  async fetchUserData() {
    const { data } = await axiosInstance.get(`${PATH}`);
    return data;
  }
}
export default new StatsService();
