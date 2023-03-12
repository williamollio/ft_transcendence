import { Box, Paper, Table, TableBody, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import { leaderBoardEntry } from "../../interfaces/stats.interface";
import LeaderboardTableHead from "./LeaderboardTableHead";
import PlayerRow from "./PlayerRow";
import TableToolbar from "./TableToolbar";

interface Props {
  query: {
    data: any;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
  };
}

export default function MainTalbe(props: Props) {
  const [filteredList, setFilteredList] = useState<Array<leaderBoardEntry>>([]);
  const [fullList, setFullList] = useState<Array<leaderBoardEntry>>([]);

  const { data, isLoading, isError, isRefetching } = props.query;

  useEffect(() => {
    if (data && !isLoading && !isError && !isRefetching) {
      const newList = new Array<leaderBoardEntry>();
      data.forEach(
        (
          element: {
            name: string;
            id: string;
            eloScore: number;
            fileName: string;
          },
          index: number
        ) => {
          newList.push({
            ...element,
            rating: element.eloScore,
            wins: 0,
            loss: 0,
            rank: index + 1,
            image: element.fileName,
          });
        }
      );
      setFullList(newList);
      setFilteredList(newList);
    }
  }, [data, isLoading, isError, isRefetching]);

  const filter = (filterValue: string) => {
    setFilteredList(
      fullList.filter((element: leaderBoardEntry) =>
        element.name.includes(filterValue)
      )
    );
  };

  const findName = (id: string) => {
    let found = fullList.find((element: { id: string }) => element.id === id);
    if (found) return found.name;
    return "Unknown Player";
  };

  return (
    <Box sx={{ width: "97%", height: "97%" }}>
      <Paper sx={{ width: "100%", mb: 2, overflow: "hidden" }}>
        <TableToolbar filter={filter} />
        <TableContainer sx={{ maxHeight: "600px" }}>
          <Table stickyHeader>
            <LeaderboardTableHead />
            <TableBody>
              {filteredList.map((element, index) => (
                <PlayerRow
                  key={index}
                  player={element}
                  findName={findName}
                ></PlayerRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
