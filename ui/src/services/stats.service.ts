import { axiosInstance } from "./common/axios-instance";

const PATH = "users";

class StatsService {
  async fetchLeaderboard() {
    const { data } = await axiosInstance.get(`${PATH}/get-leaderboard`);
    return data;
  }

  async fetchMatchHistory(id: string) {
	const { data } = await axiosInstance.get(`${PATH}/get-user-match-history/${id}`);
	return data;
  }

  async fetchPersonalStats(id: string) {
	const { data } = await axiosInstance.get(`${PATH}/get-user-matches-stats/${id}`);
	return data;
  }
}
export default new StatsService();