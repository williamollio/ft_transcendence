import { Box, Paper, Table, TableBody, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import { leaderBoardEntry } from "../../interfaces/stats.interface";
import LeaderboardTableHead from "./LeaderboardTableHead";
import PlayerRow from "./PlayerRow";
import TableToolbar from "./TableToolbar";
import { makeStyles } from "tss-react/mui";
import classes from "../../styles.module.scss";

interface Props {
  query: {
    data: any;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
  };
}

export default function MainTalbe(props: Props) {
  const { classes } = useStyles();

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
            filename: string;
            numberOfWin: number;
            numberOfLoss: number;
          },
          index: number
        ) => {
          newList.push({
            ...element,
            rating: element.eloScore,
            rank: index + 1,
            wins: element.numberOfWin,
            loss: element.numberOfLoss,
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
    <Box className={classes.boxStyle}>
      <Paper className={classes.paperStyle} elevation={10}>
        <TableToolbar filter={filter} />
        <TableContainer className={classes.tableCont}>
          <Table className={classes.colorScheme} stickyHeader>
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

const useStyles = makeStyles()(() => ({
  colorScheme: {
    backgroundColor: "white",
  },
  tableCont: {
    maxHeight: "88%",
    overflow: "auto",
  },
  boxStyle: {
    width: "97%",
    height: "97%",
  },
  paperStyle: {
    width: "100%",
    height: "100%",
    mb: 2,
    overflow: "hidden",
    backgroundColor: classes.colorPrimary,
  },
}));
