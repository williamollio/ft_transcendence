import React from "react";
import Navbar from "../../components/Navbar";
import { Typography } from "@mui/material";
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

interface Props {
  userSocket: UserSocket;
  channelSocket: ChannelSocket;
}
export default function GameView(props: Props): React.ReactElement {
  const { userSocket, channelSocket } = props;
  const { t } = useTranslation();
  //   const { classes } = useStyles();
  return (
    <>
      <Navbar />
      <LeftDrawer />
      <RightDrawer channelSocket={channelSocket} userSocket={userSocket} />
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
              <Typography></Typography>
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
      </Background>
    </>
  );
}

// const useStyles = makeStyles()(() => ({}));
