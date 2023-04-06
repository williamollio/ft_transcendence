import { Button, Grid, Paper, Slide, Switch, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../views/Game/constants";
import CustomTextField from "../shared/CustomTextField/CustomTextField";
import { FieldValues, useForm } from "react-hook-form";
import { GameSocket } from "../../classes/GameSocket.class";
import { GameMode } from "../../interfaces/chat.interface";
import ChannelService from "../../services/channel.service";
import { useContext, useState } from "react";
import { ToastType } from "../../context/toast";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import classes from "../../styles.module.scss";

interface Props {
  gameSocket: GameSocket;
}

export default function MainMenu(props: Props) {
  const { gameSocket } = props;
  const { t } = useTranslation();
  const { handleSubmit, register } = useForm({
    mode: "onChange",
  });
  const toast = useContext(TranscendanceContext);

  const [checked, toggleChecked] = useState<boolean>(false);

  const handleClassic = () => {
    gameSocket.joinGame(GameMode.CLASSIC);
  };

  const handleMayhem = () => {
    gameSocket.joinGame(GameMode.MAYHEM);
  };

  const handleQueue = () => {
    if (checked) handleMayhem();
    else handleClassic();
  };

  const handleInvite = (data: FieldValues) => {
    ChannelService.getUserByName(data.playerName).then((resolve) => {
      if (resolve.data)
        gameSocket.inviteToGame(GameMode.CLASSIC, resolve.data.id);
      else {
        toast.dispatchTranscendanceState({
          type: TranscendanceStateActionType.TOGGLE_TOAST,
          toast: {
            type: ToastType.ERROR,
            title: t(translationKeys.invite.failed) as string,
            message: `${t(translationKeys.invite.notFound)}`,
          },
        });
      }
    });
  };

  const handleSpectate = (data: FieldValues) => {
    ChannelService.getUserByName(data.playerName).then((resolve) => {
      if (resolve.data) gameSocket.joinAsSpectator(resolve.data.id);
      else {
        toast.dispatchTranscendanceState({
          type: TranscendanceStateActionType.TOGGLE_TOAST,
          toast: {
            type: ToastType.ERROR,
            title: t(translationKeys.invite.failed) as string,
            message: `${t(translationKeys.invite.notFound)}`,
          },
        });
      }
    });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
      >
        <Grid item>
          <Paper
            sx={{
              backgroundColor: classes.colorPrimary,
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            <Grid container alignItems="center" direction="row">
              <Typography color={checked ? "grey" : classes.colorAccent}>
                {t(translationKeys.buttons.classic)}
              </Typography>
              <Switch
                checked={checked}
                onChange={() => toggleChecked(!checked)}
                color="default"
              ></Switch>
              <Typography color={checked ? classes.colorAccent : "grey"}>
                {t(translationKeys.buttons.mayhem)}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleQueue}>
            <Typography>{t(translationKeys.buttons.queue)}</Typography>
          </Button>
        </Grid>
        <Grid container direction="row" justifyContent="center" spacing={1}>
          <Grid item>
            <Button
              onClick={handleSubmit(handleInvite)}
              variant="contained"
              sx={{
                width: 250,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <Typography>{t(translationKeys.buttons.invite)}</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleSubmit(handleSpectate)}
              variant="contained"
              sx={{
                width: 250,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <Typography>{t(translationKeys.buttons.watch)}</Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid item sx={{ marginTop: 1, width: 300 }}>
          <CustomTextField
            register={register}
            isRequired
            name="playerName"
            label={t(translationKeys.buttons.playerName) as string}
          />
        </Grid>
      </Grid>
    </>
  );
}
