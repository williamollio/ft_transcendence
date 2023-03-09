import { BorderBottom } from "@mui/icons-material";
import { TableRow, TableCell } from "@mui/material";

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

interface Props {
  match: testMatch;
  key: number;
}

export default function Match(props: Props) {
  const { match } = props;

  return (
    <>
      <TableRow
        sx={{
          ...(match.winner
            ? {
                backgroundColor: "limegreen",
              }
            : {
                backgroundColor: "firebrick",
              }),
        }}
      >
        <TableCell align="left" sx={{ width: "100px", borderBottom: "unset" }}>
          {match.gameMode}
        </TableCell>
        <TableCell align="right" sx={{borderBottom: "unset"}}>{match.player1.name}</TableCell>
        <TableCell align="right" sx={{borderBottom: "unset"}}>{match.player1.score}</TableCell>
		<TableCell align="center" sx={{ width: 0, borderBottom: "unset" }}>
          to
        </TableCell>
        <TableCell align="left" sx={{borderBottom: "unset"}}>{match.player2.score}</TableCell>
        <TableCell align="left" sx={{borderBottom: "unset"}}>{match.player2.name}</TableCell>
        <TableCell sx={{borderBottom: "unset"}}></TableCell>
      </TableRow>
    </>
  );
}

