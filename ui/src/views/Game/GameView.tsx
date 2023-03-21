import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Button, Typography } from "@mui/material";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import MiniDrawer from "../../components/MiniDrawer/MiniDrawer";
// import { makeStyles } from "tss-react/mui";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import GameBoard from "../../components/game/GameBoard";
import { GameLoop } from "../../classes/GameLoop.class";
import { GameSocket } from "../../classes/GameSocket.class";

interface Props {
  gameSocket: GameSocket;
}

export default function GameView(props: Props): React.ReactElement {
  const { gameSocket } = props;
  const { t } = useTranslation();
  //   const { classes } = useStyles();

  // for testing
  const [ticks, setTickts] = useState<number>(0);
  // for testing

  const [gameLoop] = useState<GameLoop>(new GameLoop(setTickts));

  return (
    <>
      <Navbar />
      <MiniDrawer />
      <Background>
        <ProfileCard>
          <CardContainer>
            <TitleWrapper>
              <Typography
                variant="h4"
                color={"secondary"}
                fontWeight={"bold"}
                sx={{ textDecoration: "underline" }}
              >
                {t(translationKeys.game)}
              </Typography>
            </TitleWrapper>
            <ContentWrapper>
              <GameBoard gameLoop={gameLoop} />
            </ContentWrapper>
            {/* for testing */}
            <Button onClick={gameLoop.startLoop}>start</Button>
            <Button onClick={gameLoop.stopLoop}>stop</Button>
            <Button onClick={gameLoop.resetPositions}>reset</Button>
            <>{ticks}</>
            {/* for testing */}
          </CardContainer>
        </ProfileCard>
      </Background>
    </>
  );
}

// const useStyles = makeStyles()(() => ({}));
