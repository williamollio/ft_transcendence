import { Avatar, Grid, IconButton, TableCell, TableRow } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import MatchHistory from "./MatchHistoy";
import { leaderBoardEntry } from "../../interfaces/stats.interface";

interface Props {
  key: any;
  player: leaderBoardEntry;
  findName: (id: string) => string;
}

export default function PlayerRow(props: Props) {
  const { player, findName } = props;
  const [open, toggleOpen] = useState<boolean>(false);
  const [openView, toggleOpenView] = useState<boolean>(false);

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
                src=""
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
              openView ? toggleOpenView(false) : false;
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
          <MatchHistory
            open={open}
            playerId={player.id}
            findName={findName}
            openView={openView}
            toggleOpenView={toggleOpenView}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
