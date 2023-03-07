import { Typography } from "@mui/material";
import { useEffect } from "react";
import { UserSocket } from "../../classes/UserSocket.class";
import Navbar from "../../components/Navbar";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { Cookie } from "../../utils/auth-helper";

interface Props {
  userSocket: UserSocket;
}

export default function StatsView(props: Props): React.ReactElement {
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
                Stats
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
