import { Grid, Paper, Typography } from "@mui/material";

export default function PauseNotification() {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item>
        <Paper sx={{padding: 2}}>
          <Typography>Game has been paused</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
