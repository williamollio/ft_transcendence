import {
  Avatar,
  Collapse,
  Grid,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import MatchHistory from "./MatchHistoy";

interface testMatch {
  player1: {
    id: string;
    name: string;
    score: number;
  };
  player2: {
    id: string;
    name: string;
    score: number;
  };
  winner: boolean;
  gameMode: "RANKED" | "CASUAL";
}

interface testList {
  id: string;
  name: string;
  rank: number;
  rating: number;
  wins: number;
  loss: number;
}

interface Props {
  key: any;
  player: testList;
}

export default function PlayerRow(props: Props) {
  const { player } = props;
  const [open, toggleOpen] = useState(false);

  const matchList = new Array<testMatch>();

  const populateMatchList = () => {
    matchList.push({player1: {id: "test", name: "test", score: 5}, player2: {id: "test2", name: "test2", score: 2}, winner: true, gameMode: "CASUAL"});
    matchList.push({player1: {id: "test", name: "test", score: 3}, player2: {id: "test2", name: "test2", score: 6}, winner: false, gameMode: "RANKED"});
    matchList.push({player1: {id: "test", name: "test", score: 4}, player2: {id: "test2", name: "test2", score: 3}, winner: true, gameMode: "RANKED"});
    matchList.push({player1: {id: "test", name: "test", score: 5}, player2: {id: "test2", name: "test2", score: 8}, winner: false, gameMode: "CASUAL"});
    matchList.push({player1: {id: "test", name: "test", score: 7}, player2: {id: "test2", name: "test2", score: 1}, winner: true, gameMode: "CASUAL"});
    matchList.push({player1: {id: "test", name: "test", score: 5}, player2: {id: "test2", name: "test2", score: 20}, winner: false, gameMode: "RANKED"});
    matchList.push({player1: {id: "test", name: "test", score: 10}, player2: {id: "test2", name: "test2", score: 0}, winner: true, gameMode: "CASUAL"});
  };

  populateMatchList();

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left" sx={{ width: "50px" }}>
          #{player.rank}
        </TableCell>
        <TableCell sx={{ width: "150px" }}>
          <Grid container alignItems="center" justifyContent="left">
            <Grid item>
              <Avatar
                style={{
                  width: "45px",
                  height: "45px",
                }}
                src={""}
              />
            </Grid>
            <Grid item marginLeft="10px">
              {player.name}
            </Grid>
          </Grid>
        </TableCell>
        <TableCell align="center">{player.rating}</TableCell>
        <TableCell align="center">
          {player.wins}:{player.loss}
        </TableCell>
        <TableCell align="right">
          <IconButton
            onClick={() => {
              toggleOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          padding="none"
          sx={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={5}
        >
          <Collapse in={open} unmountOnExit>
            <MatchHistory match={matchList} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
