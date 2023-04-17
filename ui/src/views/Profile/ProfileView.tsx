import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import usersService from "../../services/users.service";
import { User } from "../../interfaces/user.interface";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import { AxiosError } from "axios";
import { TranscendanceContext } from "../../context/transcendance-context";
import { ToastType } from "../../context/toast";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import {
  Background,
  CardContainer,
  ProfileCard,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { Cookie, getTokenData } from "../../utils/auth-helper";
import CustomTextField from "../../components/shared/CustomTextField/CustomTextField";
import { fetchProfilePicture } from "../../utils/picture-helper";
import PersonalStatPanel from "../../components/stats/PersonalStatPanel";

export default function ProfileView(): React.ReactElement {
  const userIdParam = useLocation().state;
  const { t } = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [image, setImage] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token] = useState<string | null>(localStorage.getItem(Cookie.TOKEN));

  React.useEffect(() => {
    if (token === null) {
      navigate(RoutePath.LOGIN);
    }
  }, []);

  React.useEffect(() => {
    wrapperSetUserId(token);
    if (userId) {
      fetchCurrentUser();
      wrapperFetchProfilePicture(userId);
      setIsLoading(false);
    }
  }, [userId, userIdParam]);

  async function wrapperFetchProfilePicture(userId: string) {
    const pictureFetched = await fetchProfilePicture(userId);
    if (pictureFetched) setImage(pictureFetched);
    else setImage("");
  }

  function wrapperSetUserId(token: string | null) {
    if (!userIdParam || !userIdParam.user || userIdParam.user === ":user") {
      if (token) setUserId(getTokenData(token).id);
      else navigate(RoutePath.LOGIN);
    } else {
      setUserId(userIdParam.user);
    }
  }

  function showErrorToast(error?: AxiosError) {
    const message = (error?.response?.data as any).message as string;
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.ERROR,
        title: "Error",
        message: message,
      },
    });
  }

  async function fetchCurrentUser() {
    const user = await usersService.getUser(userId);
    const isSuccess = !user?.error;
    if (!isSuccess) {
      showErrorToast(user.error);
      setCurrentUser(null);
    } else {
      setCurrentUser(user.data);
    }
  }

  return (
    <>
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
                {t(translationKeys.profile)}
              </Typography>
            </TitleWrapper>
            <ContentWrapper>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Box
                    sx={{
                      width: "70%",
                      height: "12rem",
                      marginTop: "2rem",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      flexWrap: "no-wrap",
                    }}
                  >
                    <Box className={classes.avatarWrapper}>
                      <Tooltip title="Profile picture">
                        <Avatar
                          src={image ? URL.createObjectURL(image) : ""}
                          style={{
                            width: "100px",
                            height: "100px",
                          }}
                        />
                      </Tooltip>
                    </Box>
                    <Box sx={{ width: "40%" }}>
                      <CustomTextField
                        label={"Name"}
                        name="name"
                        value={currentUser ? currentUser.name : ""}
                        disable
                      />
                    </Box>
                  </Box>
                </>
              )}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  paddingTop: "4rem",
                  justifyContent: "space-around",
                }}
              >
                <PersonalStatPanel
                  playerId={userId}
                  lr={false}
                  type={"Ranked"}
                  title={t(translationKeys.ranked)}
                />
                <PersonalStatPanel
                  playerId={userId}
                  lr={true}
                  type={"General"}
                  title={t(translationKeys.general)}
                />
              </Box>
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
      </Background>
    </>
  );
}

// https://github.com/garronej/tss-react
const useStyles = makeStyles()(() => ({
  avatarWrapper: {
    height: "65%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
  },
}));
