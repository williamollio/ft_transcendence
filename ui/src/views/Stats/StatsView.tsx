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

interface Props {
  userSocket: UserSocket;
}

export default function StatsView(props: Props): React.ReactElement {
	const { t } = useTranslation();
	// const { classes } = useStyles();
  const { userSocket } = props;

  useEffect(() => {
    let token = localStorage.getItem(Cookie.TOKEN);
    if (token) {
      userSocket.initializeSocket(token);
      userSocket.logIn();
    }
    return () => {
      userSocket.socket?.disconnect();
    };
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
				<MainTable></MainTable>
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
      </Background>
    </>
  );
}

// const useStyles = makeStyles()(() => ({}));
