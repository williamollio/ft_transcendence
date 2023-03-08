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

interface Props {
  userSocket: UserSocket;
  channelSocket: ChannelSocket;
}

export default function GameView(props: Props): React.ReactElement {
  const { userSocket, channelSocket } = props;
  const { t } = useTranslation();
  // const { classes } = useStyles();

  //   const [channelSocket] = React.useState<ChannelSocket>(new ChannelSocket());

  React.useEffect(() => {
    if (channelSocket.socket.connected === false) {
      let gotToken;
      if ((gotToken = localStorage.getItem(Cookie.TOKEN))) {
        if (typeof channelSocket.socket.auth === "object")
          channelSocket.socket.auth.token = "Bearer " + gotToken;
      }
      channelSocket.initializeSocket(gotToken);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Background>
        <ProfileCard>
          <Chat channelSocket={channelSocket} userSocket={userSocket} />
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
