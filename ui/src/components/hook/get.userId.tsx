import { Typography } from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";

function FetchUserId({userId}: {userId: string}) {
  const { isLoading, error, data, isFetching } = useQuery(
    userId,
    () =>
      axios
        .get("http://localhost:8080/users/" + userId)
        .then((res) => res.data)
  );
  if (data) console.log(data.data);

  if (isLoading) return <>"Loading..."</>;

  if (error) return <>"An error has occurred: {error}</>;

}

export default function getUserId(userId: string) {
}
