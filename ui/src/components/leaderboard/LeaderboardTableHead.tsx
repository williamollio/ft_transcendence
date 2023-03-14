import { TableHead, TableRow, TableCell } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import classes from "../../styles.module.scss";

export default function LeaderboardTableHead() {
  const { classes } = useStyles();

  return (
    <TableHead>
      <TableRow className={classes.tableHead}>
        <TableCell align="left">Rank</TableCell>
        <TableCell align="center">Player</TableCell>
        <TableCell align="center">Rating</TableCell>
        <TableCell align="center">Win : Loss</TableCell>
        <TableCell align="center" sx={{ width: "90px" }}>
          Match History
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles()(() => ({
  tableHead: {
    "& .MuiTableCell-head": {
      backgroundColor: classes.colorPrimary,
      color: classes.colorPrimary,
      WebkitTextFillColor: classes.colorSecondary,
    },
  },
}));
