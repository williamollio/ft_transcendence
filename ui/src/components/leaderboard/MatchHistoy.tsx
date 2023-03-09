import { TableContainer, Table, TableBody, Box } from "@mui/material";
import Match from "./Match";

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
  match: testMatch[];
}

export default function MatchHistory(props: Props) {
  const { match } = props;

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            {match.map((element, index) => (
              <Match match={element} key={index}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
