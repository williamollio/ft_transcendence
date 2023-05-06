import {
  Button,
  Grid,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../views/Game/constants";
import CustomTextField from "../shared/CustomTextField/CustomTextField";
import { FieldValues, useForm } from "react-hook-form";
import { BigSocket } from "../../classes/BigSocket.class";
import { GameMode } from "../../interfaces/chat.interface";
import ChannelService from "../../services/channel.service";
import React, { useContext, useState } from "react";
import { ToastType } from "../../context/toast";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import classes from "../../styles.module.scss";
import { GameLoop } from "../../classes/GameLoop.class";
import PauseNotification, { PauseState } from "./PauseNotification";

interface Props {
  bigSocket: BigSocket;
  gameLoop: GameLoop;
  pauseContent: PauseState;
  setPauseContent: React.Dispatch<React.SetStateAction<PauseState | false>>;
}

export default function MainMenu(props: Props) {
  const { bigSocket, gameLoop, pauseContent, setPauseContent } = props;
  const { t } = useTranslation();
  const { handleSubmit, register } = useForm({
    mode: "onChange",
  });
  const toast = useContext(TranscendanceContext);

  const [checked, toggleChecked] = useState<boolean>(false);

  const handleClassic = () => {
    gameLoop.gameConstants.playerSpeed = 7;
    bigSocket.joinGame(GameMode.CLASSIC);
  };

  const handleMayhem = () => {
    gameLoop.gameConstants.playerSpeed = 12;
    bigSocket.joinGame(GameMode.MAYHEM);
  };

  const handleQueue = () => {
    if (checked) handleMayhem();
    else handleClassic();
    setPauseContent(PauseState.queued);
  };

  const handleInvite = (data: FieldValues) => {
    ChannelService.getUserByName(data.playerName).then((resolve) => {
      if (resolve.data)
        bigSocket.inviteToGame(
          checked ? GameMode.MAYHEM : GameMode.CLASSIC,
          resolve.data.id
        );
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
      if (resolve.data) bigSocket.joinAsSpectator(resolve.data.id);
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

  const tooltipClassic = () => {
    return (
      <>
        <Typography fontWeight="bold" fontSize={12}>
          {t(translationKeys.buttons.classic)}
        </Typography>
        <Typography fontSize={12}>
          {t(translationKeys.tooltips.classic)}
        </Typography>
      </>
    );
  };

  const tooltipMayhem = () => {
    return (
      <>
        <Typography fontWeight="bold" fontSize={12}>
          {t(translationKeys.buttons.mayhem)}
        </Typography>
        <Typography fontSize={12}>
          {t(translationKeys.tooltips.mayhem)}
        </Typography>
      </>
    );
  };

  const tooltipQueue = () => {
    return (
      <>
        <Typography fontWeight="bold" fontSize={12}>
          {t(translationKeys.buttons.queue)}
        </Typography>
        <Typography fontSize={12}>
          {t(translationKeys.tooltips.queue)}
        </Typography>
      </>
    );
  };

  const tooltipInvite = () => {
    return (
      <>
        <Typography fontWeight="bold" fontSize={12}>
          {t(translationKeys.buttons.invite)}
        </Typography>
        <Typography fontSize={12}>
          {t(translationKeys.tooltips.invite)}
        </Typography>
      </>
    );
  };

  const tooltipSpectate = () => {
    return (
      <>
        <Typography fontWeight="bold" fontSize={12}>
          {t(translationKeys.buttons.watch)}
        </Typography>
        <Typography fontSize={12}>
          {t(translationKeys.tooltips.spectate)}
        </Typography>
      </>
    );
  };

  const tooltipPlayerName = () => {
    return (
      <>
        <Typography fontWeight="bold" fontSize={12}>
          {t(translationKeys.buttons.playerName)}
        </Typography>
        <Typography fontSize={12}>
          {t(translationKeys.tooltips.playerName)}
        </Typography>
      </>
    );
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
        {pauseContent === PauseState.main ? (
          <>
            <Grid item>
              <Paper
                sx={{
                  backgroundColor: classes.colorPrimary,
                  width: 300,
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  direction="row"
                >
                  <Tooltip title={tooltipClassic()}>
                    <Typography color={checked ? "grey" : classes.colorAccent}>
                      {t(translationKeys.buttons.classic)}
                    </Typography>
                  </Tooltip>
                  <Switch
                    checked={checked}
                    onChange={() => toggleChecked(!checked)}
                    color="default"
                  ></Switch>
                  <Tooltip title={tooltipMayhem()}>
                    <Typography color={checked ? classes.colorAccent : "grey"}>
                      {t(translationKeys.buttons.mayhem)}
                    </Typography>
                  </Tooltip>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <Tooltip title={tooltipQueue()}>
                <Button
                  sx={{ width: 300 }}
                  variant="contained"
                  onClick={handleQueue}
                >
                  <Typography>{t(translationKeys.buttons.queue)}</Typography>
                </Button>
              </Tooltip>
            </Grid>
            <Grid container direction="row" justifyContent="center" spacing={1}>
              <Grid item>
                <Tooltip title={tooltipInvite()}>
                  <Button
                    onClick={handleSubmit(handleInvite)}
                    variant="contained"
                    sx={{
                      width: 146,
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                  >
                    <Typography>{t(translationKeys.buttons.invite)}</Typography>
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title={tooltipSpectate()}>
                  <Button
                    onClick={handleSubmit(handleSpectate)}
                    variant="contained"
                    sx={{
                      width: 146,
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                  >
                    <Typography>{t(translationKeys.buttons.watch)}</Typography>
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
            <Tooltip title={tooltipPlayerName()}>
              <Grid item sx={{ marginTop: 1, width: 300 }}>
                <CustomTextField
                  register={register}
                  name="playerName"
                  label={t(translationKeys.buttons.playerName) as string}
                />
              </Grid>
            </Tooltip>
          </>
        ) : (
          <Grid item>
            <PauseNotification variant={pauseContent} />
          </Grid>
        )}
      </Grid>
    </>
  );
}
