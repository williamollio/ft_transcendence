import { TableHead, TableRow, TableCell } from "@mui/material";

export default function LeaderboardTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="left">Rank</TableCell>
        <TableCell align="center">Player</TableCell>
        <TableCell align="center">Score</TableCell>
        <TableCell align="center">Win : Loss</TableCell>
        <TableCell align="center" sx={{width: "90px"}}>Match History</TableCell>
      </TableRow>
    </TableHead>
  );
}
