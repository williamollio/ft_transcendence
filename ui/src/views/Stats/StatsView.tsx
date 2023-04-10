import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { UserSocket } from "../../classes/UserSocket.class";
import Navbar from "../../components/Navbar";
import React from "react";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import LeftDrawer from "../../components/LeftDrawer/LeftDrawer";
// import { makeStyles } from "tss-react/mui";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { Cookie, getTokenData } from "../../utils/auth-helper";
import MainTable from "../../components/stats/MainTable";
import StatsService from "../../services/stats.service";
import { useQuery } from "@tanstack/react-query";
import PersonalStatPanel from "../../components/stats/PersonalStatPanel";
import RightDrawer from "../../components/RightDrawer/RightDrawer";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { GameSocket } from "../../classes/GameSocket.class";
import classes from "../../styles.module.scss";

interface Props {
  userSocket: UserSocket;
  channelSocket: ChannelSocket;
  gameSocket: GameSocket;
}

export default function StatsView(props: Props): React.ReactElement {
  const { userSocket, channelSocket, gameSocket } = props;
  const { t } = useTranslation();
  // const { classes } = useStyles();

  const getUserId = (): { id: string } => {
    let token = localStorage.getItem(Cookie.TOKEN);
    if (token) return getTokenData(token);
    return { id: "" };
  };

  const [userId] = useState<string>(getUserId().id);

  const query: {
    data: any;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
  } = useQuery(["playerList"], StatsService.fetchLeaderboard);

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
        <PersonalStatPanel
          playerId={userId}
          lr={true}
          type={"General"}
          title={t(translationKeys.general)}
        />
        <ProfileCard sx={{ bgcolor: classes.colorPrimary }}>
          <CardContainer>
            <TitleWrapper>
              <Typography
                variant="h4"
                color={"secondary"}
                fontWeight={"bold"}
                sx={{ textDecoration: "underline" }}
              >
                {t(translationKeys.stats)}
              </Typography>
            </TitleWrapper>
            <ContentWrapper>
              <MainTable query={query}></MainTable>
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
        <PersonalStatPanel
          playerId={userId}
          lr={false}
          type={"Ranked"}
          title={t(translationKeys.ranked)}
        />
      </Background>
    </>
  );
}

// const useStyles = makeStyles()(() => ({}));
