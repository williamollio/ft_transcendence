import { Typography } from "@mui/material";
import { useEffect } from "react";
import { UserSocket } from "../../classes/UserSocket.class";
import Navbar from "../../components/Navbar";
import React from "react";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
// import { makeStyles } from "tss-react/mui";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { Cookie } from "../../utils/auth-helper";
import MainTable from "../../components/leaderboard/MainTable";
import StatsService from "../../services/stats.service";
import { useQuery } from "@tanstack/react-query";

interface Props {
  userSocket: UserSocket;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export default function StatsView(props: Props): React.ReactElement {
  const { userSocket, setToken } = props;
  const { t } = useTranslation();
  // const { classes } = useStyles();

  const query: { data: any, isLoading: boolean, isError: boolean, isRefetching: boolean } = useQuery(
    ["playerList"],
    StatsService.fetchUserData
  );

  React.useEffect(() => {
    if (userSocket.socket.connected === false) {
      let gotToken = localStorage.getItem(Cookie.TOKEN);
      if (gotToken) {
        if (typeof userSocket.socket.auth === "object") {
          setToken("Bearer " + gotToken);
        }
      }
    } else userSocket.logIn();
  }, []);

  return (
    <>
      <Navbar />
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
                {t(translationKeys.stats)}
              </Typography>
            </TitleWrapper>
            <ContentWrapper>
              <MainTable query={query}></MainTable>
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
      </Background>
    </>
  );
}

// const useStyles = makeStyles()(() => ({}));
