import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import { BigSocket } from "../../classes/BigSocket.class";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import classes from "../../styles.module.scss";
import Game from "../../components/game/Game";

interface Props {
  bigSocket: BigSocket;
}

export default function GameView(props: Props): React.ReactElement {
  const { bigSocket } = props;
  const { t } = useTranslation();

  const handleLeave = () => {
    bigSocket.leave();
  };

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
                  <Game bigSocket={bigSocket} />
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={handleLeave}>
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
