import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TablePagination,
} from "@mui/material";

interface match {
	player1: {
		id: string;
		score: string;
	}
	player2: {
		id: string;
		score: string;
	}
}

export default function MatchHistory() {
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow
              sx={{
                "& > *": { borderBottom: "unset" },
                backgroundColor: "firebrick",
              }}
            >
              <TableCell
                align="left"
                sx={{ width: "100px", borderBottom: "unset" }}
              >
                Ranked
              </TableCell>
              <TableCell align="right">Player 1 name</TableCell>
              <TableCell align="right">score</TableCell>
              <TableCell
                align="center"
                sx={{ width: 0, borderBottom: "unset" }}
              >
                to
              </TableCell>
              <TableCell align="left">score</TableCell>
              <TableCell align="left">Player 2 name</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
