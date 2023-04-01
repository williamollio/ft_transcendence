import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../../components/Navbar";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  TextField,
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
import { useImageStore } from "../../store/users-store";
import {
  Background,
  CardContainer,
  ProfileCard,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { Cookie, getTokenData } from "../../utils/auth-helper";
import LeftDrawer from "../../components/LeftDrawer/LeftDrawer";
import { UserSocket } from "../../classes/UserSocket.class";
import RightDrawer from "../../components/RightDrawer/RightDrawer";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { GameSocket } from "../../classes/GameSocket.class";
import { useParams } from "react-router-dom";
import CustomTextField from "../../components/shared/CustomTextField/CustomTextField";
import { fetchProfilePicture } from "../../utils/picture-helper";

interface Props {
  userSocket: UserSocket;
  channelSocket: ChannelSocket;
  gameSocket: GameSocket;
}

export default function ProfileView(props: Props): React.ReactElement {
  const { userSocket, channelSocket, gameSocket } = props;
  const userIdParam = useParams().userId;
  const { t } = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [image, setImage] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>();
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
      setIsLoading(false);
    }
  }, [userId, userIdParam]);

  React.useEffect(() => {
    async function loadProfilePictures() {
      if (currentUser?.filename) {
        const picture = await getProfilePicture(currentUser.id);
        setImage(picture);
      } else {
        setImage("");
      }
    }

    loadProfilePictures();
  }, [userId]);

  async function getProfilePicture(friendId: string): Promise<string> {
    const image = await fetchProfilePicture(friendId);
    return URL.createObjectURL(image);
  }

  function wrapperSetUserId(token: string | null) {
    if (!userIdParam || userIdParam === ":userId") {
      if (token) setUserId(getTokenData(token).id);
      else navigate(RoutePath.LOGIN);
    } else {
      setUserId(userIdParam);
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
    setCurrentUser(user.data);
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
      <Navbar userSocket={userSocket} />
      <LeftDrawer channelSocket={channelSocket} userSocket={userSocket} />
      <RightDrawer
        channelSocket={channelSocket}
        userSocket={userSocket}
        gameSocket={gameSocket}
      />
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
                        value={currentUser?.name}
                      />
                    </Box>
                  </Box>
                </>
              )}
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
  buttonsWrapper: {
    height: "40%",
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    gap: "1em",
  },
  buttonRequestWrapper: {
    height: "10%",
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
  },
  uploadButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    height: "35%",
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    height: "70%",
    width: "70%",
    minHeight: "77px",
  },
  multiInputWrapper: {
    width: "65%",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    minHeight: "77px",
  },
}));
