import { TableContainer, Table, TableBody, Box, Collapse } from "@mui/material";
import Match from "./Match";
import { useQuery } from "@tanstack/react-query";
import StatsService from "../../services/stats.service";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { match, MatchHistoryDto } from "../../interfaces/stats.interface";

interface Props {
  open: boolean;
  openView: boolean;
  toggleOpenView: Dispatch<SetStateAction<boolean>>;
  playerId: string;
  findName: (id: string) => string;
}

export default function MatchHistory(props: Props) {
  const { playerId, open, findName, openView, toggleOpenView } = props;

  const { data, isLoading, isError, isRefetching } = useQuery(
    ["matchHistory", playerId],
    () => StatsService.fetchMatchHistory(playerId),
    { enabled: playerId !== "" && open === true }
  );

  const [matchHistory, setMatchHistory] = useState<Array<match>>([]);

  useEffect(() => {
    if (data && !isLoading && !isError && !isRefetching) {
      const newList = new Array<match>();
      data.forEach((element: MatchHistoryDto) => {
        newList.push({
          player1: {
            id: element.currentUserId,
            score: element.p1Score,
            image: element.imageCurrentUser,
          },
          player2: {
            id: element.opponentId,
            score: element.p2Score,
            image: element.imageOpponent,
          },
          winner: element.matchWon,
        });
      });
      setMatchHistory(newList);
      toggleOpenView(true);
    }
  }, [data, isLoading, isError, isRefetching]);

  return (
    <Collapse in={openView}>
      <Box>
        <Table>
          <TableBody>
            {matchHistory.map((element, index) => (
              <Match match={element} key={index} findName={findName} />
            ))}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
}
