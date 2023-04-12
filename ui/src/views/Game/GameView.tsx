import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import { UserSocket } from "../../classes/UserSocket.class";
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
}

export default function GameView(props: Props): React.ReactElement {
  const { gameSocket, userSocket } = props;
  const { t } = useTranslation();

  return (
    <>
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
