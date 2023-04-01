import React from "react";
import Navbar from "../../components/Navbar";
import { Button, Grid, Typography } from "@mui/material";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import LeftDrawer from "../../components/LeftDrawer/LeftDrawer";
import RightDrawer from "../../components/RightDrawer/RightDrawer";
import { UserSocket } from "../../classes/UserSocket.class";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
// import { makeStyles } from "tss-react/mui";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { GameSocket } from "../../classes/GameSocket.class";
import { GameMode } from "../../interfaces/chat.interface";
import classes from "../../styles.module.scss";
import Game from "../../components/game/Game";

interface Props {
  gameSocket: GameSocket;
  userSocket: UserSocket;
  channelSocket: ChannelSocket;
}

export default function GameView(props: Props): React.ReactElement {
  const { gameSocket, userSocket, channelSocket } = props;
  const { t } = useTranslation();
  //   const { classes } = useStyles();

  return (
    <>
      <Navbar userSocket={userSocket} />
      <LeftDrawer channelSocket={channelSocket} userSocket={userSocket} />
      <RightDrawer
        channelSocket={channelSocket}
        userSocket={userSocket}
        gameSocket={gameSocket}
      />
      <Background>
        <ProfileCard sx={{ bgcolor: classes.colorPrimary }}>
          <CardContainer>
            <TitleWrapper>
              <Typography
                variant="h4"
                color={"secondary"}
                fontWeight={"bold"}
                sx={{ textDecoration: "underline" }}
              >
                {t(translationKeys.gameMode.classic)}
              </Typography>
            </TitleWrapper>
            <ContentWrapper>
              <Game gameSocket={gameSocket} userSocket={userSocket} />
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
      </Background>
      {/* for testing */}
      <Grid container direction="row" marginLeft={"20rem"}>
        <Grid item width={100}>
          <Button
            sx={{ width: 70 }}
            onClick={() => gameSocket.joinGame(GameMode.CLASSIC)}
          >
            queue Up (mode: Classic)
          </Button>
        </Grid>
        <Grid item width={100}>
          <Button
            sx={{ width: 70 }}
            onClick={() => gameSocket.joinGame(GameMode.MAYHEM)}
          >
            queue Up (mode: Mayhem)
          </Button>
        </Grid>
        <Grid item width={100}>
          <Button
            sx={{ width: 70 }}
            onClick={() =>
              gameSocket.joinAsSpectator("clfiqolxb0000obayrxl47r5s")
            }
          >
            watch game
          </Button>
        </Grid>
        <Grid item width={100}>
          <Button
            sx={{ width: 70 }}
            onClick={() => gameSocket.leaveAsSpectator()}
          >
            leave watch game
          </Button>
        </Grid>
      </Grid>
      {/* for testing */}
    </>
  );
}

// const useStyles = makeStyles()(() => ({}));
