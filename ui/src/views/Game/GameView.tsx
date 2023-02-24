import React from "react";
import Navbar from "../../components/Navbar";
import { Typography, TextField, Paper } from "@mui/material";
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
import { QueryClient, QueryClientProvider } from "react-query";
import { Cookie } from "../../utils/auth-helper";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { UserSocket } from "../../classes/UserSocket.class";

const queryClient = new QueryClient();

export default function GameView(): React.ReactElement {
  const { t } = useTranslation();
  //   const { classes } = useStyles();

  const [channelSocket] = React.useState<ChannelSocket>(new ChannelSocket());

  React.useEffect(() => {
    let token;

    if ((token = localStorage.getItem(Cookie.TOKEN))) {
      channelSocket.initializeSocket(token);
      const userSocket = new UserSocket();
      userSocket.initializeSocket(token);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Background>
        <ProfileCard>
          <QueryClientProvider client={queryClient}>
            <Chat channelSocket={channelSocket} />
          </QueryClientProvider>
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
