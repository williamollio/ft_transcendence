import { Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../views/Game/constants";
import classes from "../../styles.module.scss";

export const enum PauseState {
  paused = "PAUSED",
  queued = "QUEUED",
  main = "MAIN",
}

interface Props {
  variant: PauseState;
}

export default function PauseNotification(props: Props) {
  const { variant } = props;
  const { t } = useTranslation();

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item>
        <Paper
          sx={{
            padding: 2,
            backgroundColor: classes.colorPrimary,
            WebkitTextFillColor: "white",
          }}
        >
          <Typography>
            {variant === PauseState.paused
              ? t(translationKeys.pauseMenu.paused)
              : variant === PauseState.queued
              ? t(translationKeys.pauseMenu.queue)
              : false}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
