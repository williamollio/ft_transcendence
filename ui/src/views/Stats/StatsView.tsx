import { Typography } from "@mui/material";
import { useState } from "react";
import React from "react";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
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
import classes from "../../styles.module.scss";

export default function StatsView(): React.ReactElement {
  const { t } = useTranslation();

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
