import React from "react";
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
import { Cookie } from "../../utils/auth-helper";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { UserSocket } from "../../classes/UserSocket.class";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface Props {
  userSocket: UserSocket;
}

export default function GameView(props: Props): React.ReactElement {
  const { userSocket } = props;
  const { t } = useTranslation();
  // const { classes } = useStyles();

  const [channelSocket] = React.useState<ChannelSocket>(new ChannelSocket());
  //   const [userSocket] = React.useState<UserSocket>(new UserSocket());

  React.useEffect(() => {
    let token;
    if ((token = localStorage.getItem(Cookie.TOKEN))) {
      channelSocket.initializeSocket(token);
      //   userSocket.initializeSocket(token);
    }
    return () => {
      channelSocket.socket?.disconnect();
      //   userSocket.socket?.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <Background>
        <ProfileCard>
          <Chat channelSocket={channelSocket} userSocket={userSocket} />
          <ReactQueryDevtools></ReactQueryDevtools>
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
