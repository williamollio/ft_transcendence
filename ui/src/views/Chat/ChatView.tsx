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
import LeftDrawer from "../../components/LeftDrawer/LeftDrawer";

interface Props {
  userSocket: UserSocket;
  channelSocket: ChannelSocket;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChatView(props: Props): React.ReactElement {
  const { userSocket, channelSocket, setToken } = props;
  const { t } = useTranslation();
  // const { classes } = useStyles();

  React.useEffect(() => {
    let gotToken = localStorage.getItem(Cookie.TOKEN);
    if (gotToken) {
      if (channelSocket.socket.connected === false) {
        setToken("Bearer " + gotToken);
      }
      channelSocket.initializeName(gotToken);
    }
  }, []);

  return (
    <>
      <Navbar />
      <LeftDrawer />
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
