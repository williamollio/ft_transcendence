import { TableRow, TableCell, Avatar, Grid } from "@mui/material";
import { match } from "../../interfaces/stats.interface";

interface Props {
  match: match;
  key: number;
  findName: (id: string) => string;
}

export default function Match(props: Props) {
  const { match, findName } = props;

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
          Ranked
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: "unset" }}>
          <Grid container alignItems="center" justifyContent="right">
            <Grid item>
              <Avatar
                style={{
                  width: "25px",
                  height: "25px",
                }}
                src=""
              />
            </Grid>
            <Grid item marginLeft="10px">
              {findName(match.player1.id)}
            </Grid>
          </Grid>
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: "unset" }}>
          {match.player1.score}
        </TableCell>
        <TableCell align="center" sx={{ width: 0, borderBottom: "unset" }}>
          to
        </TableCell>
        <TableCell align="left" sx={{ borderBottom: "unset" }}>
          {match.player2.score}
        </TableCell>
        <TableCell align="left" sx={{ borderBottom: "unset" }}>
          <Grid container alignItems="center" justifyContent="left">
            <Grid item>
              <Avatar
                style={{
                  width: "25px",
                  height: "25px",
                }}
                src=""
              />
            </Grid>
            <Grid item marginLeft="10px">
              {findName(match.player2.id)}
            </Grid>
          </Grid>
        </TableCell>
        <TableCell sx={{ borderBottom: "unset" }}></TableCell>
      </TableRow>
    </>
  );
}
