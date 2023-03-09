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

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
        <TableCell padding="none" sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} unmountOnExit>
            <MatchHistory></MatchHistory>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
