import { Grid, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import { scoreInfo } from "../../interfaces/game.interface";

interface Props {
  scoreInfo: scoreInfo;
}

export default function ScoreDisplay(props: Props) {
  const { scoreInfo } = props;

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-evenly"
      sx={{ width: "100%", height: 80 }}
    >
      <Grid item>
        <Typography fontSize={30}>{scoreInfo.p1s}</Typography>
      </Grid>
      <Grid item marginLeft={10}>
        <Typography fontSize={20}>{scoreInfo.p1name}</Typography>
      </Grid>
      <Grid container direction="column" flex={0}>
        <Grid item>
          <BoltIcon sx={{ color: "yellow" }} />
        </Grid>
        <Grid item>
          <Typography fontWeight="bold" color="yellow">
            VS
          </Typography>
        </Grid>
        <Grid item>
          <BoltIcon sx={{ color: "yellow" }} />
        </Grid>
      </Grid>
      <Grid item marginRight={10}>
        <Typography fontSize={20}>{scoreInfo.p2name}</Typography>
      </Grid>
      <Grid item>
        <Typography fontSize={30}>{scoreInfo.p2s}</Typography>
      </Grid>
    </Grid>
  );
}
