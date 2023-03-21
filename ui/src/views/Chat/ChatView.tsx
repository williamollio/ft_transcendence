import React, { SetStateAction } from "react";
import Navbar from "../../components/Navbar";
import { Typography } from "@mui/material";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import Chat from "./Chat";
// import { makeStyles } from "tss-react/mui";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { UserSocket } from "../../classes/UserSocket.class";
import MiniDrawer from "../../components/MiniDrawer/MiniDrawer";
import { GameSocket } from "../../classes/GameSocket.class";

interface Props {
  userSocket: UserSocket;
  channelSocket: ChannelSocket;
  gameSocket: GameSocket;
}

export default function ChatView(props: Props): React.ReactElement {
  const { userSocket, channelSocket, gameSocket } = props;
  const { t } = useTranslation();
  // const { classes } = useStyles();

  return (
    <>
      <Navbar />
      <MiniDrawer />
      <Background>
        <ProfileCard>
          <Chat channelSocket={channelSocket} userSocket={userSocket} gameSocket={gameSocket}/>
          <CardContainer>
            <TitleWrapper>
              <Typography
                variant="h4"
                color={"secondary"}
                fontWeight={"bold"}
                sx={{ textDecoration: "underline" }}
              >
                {t(translationKeys.chat)}
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
