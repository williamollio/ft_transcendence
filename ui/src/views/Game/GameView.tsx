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
                {t(translationKeys.title)}
              </Typography>
            </TitleWrapper>
            <ContentWrapper>
              <Grid container justifyContent="center">
                <Grid item>
                  <Game gameSocket={gameSocket} userSocket={userSocket} />
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={gameSocket.leave}>
                    {t(translationKeys.buttons.leaveGame)}
                  </Button>
                </Grid>
              </Grid>
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
      </Background>
    </>
  );
}

// const useStyles = makeStyles()(() => ({}));
