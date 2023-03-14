import React, { ChangeEvent, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../../components/Navbar";
import {
  Box,
  Button,
  Typography,
  Input,
  Avatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import usersService from "../../services/users.service";
import { User } from "../../interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import { AxiosError } from "axios";
import { TranscendanceContext } from "../../context/transcendance-context";
import { ToastType } from "../../context/toast";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { Response } from "../../services/common/resolve";
import { LabelValue } from "../../interfaces/common.interface";
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
import { Controller, FieldValues, useForm } from "react-hook-form";
import CustomMultiSelect from "../../components/shared/CustomMultiSelect/CustomMultiselect";
import CustomTextField from "../../components/shared/CustomTextField/CustomTextField";
import { Cookie, getTokenData } from "../../utils/auth-helper";
import MiniDrawer from "../../components/MiniDrawer/MiniDrawer";
import friendshipsService from "../../services/friendships.service";
import { UserSocket } from "../../classes/UserSocket.class";

interface Props {
  userSocket: UserSocket;
}

export default function ProfileView(props: Props): React.ReactElement {
  const { userSocket } = props;
  const { t } = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [picture, setPicture] = useState<any>();
  const [image, setImage] = useImageStore(
    (state: { image: any; setImage: any }) => [state.image, state.setImage]
  );
  const [users, setUsers] = useState<LabelValue[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [initialName, setInitialName] = useState<string>();
  const [token] = useState<string | null>(localStorage.getItem(Cookie.TOKEN));

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm({
    mode: "onChange",
  });

  React.useEffect(() => {
    if (token) {
      userSocket.initializeSocket(token);
      userSocket.logIn();
    }
    return () => {
      userSocket.socket?.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (token === null) {
      navigate(RoutePath.LOGIN);
    } else {
      setUserId(getTokenData(token).id);
      if (userId) {
        Promise.all([fetchUsersWithoutFriendship(), fetchCurrentUser()])
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            showErrorToast(error);
          });
      }
    }
  }, [userId]);

  React.useEffect(() => {
    for (const property in currentUser) {
      if (property === "name") {
        setValue(property, currentUser.name);
        setInitialName(currentUser.name);
      }
    }
  }, [currentUser]);

  async function fetchCurrentUser() {
    const user = await usersService.getUser(userId);
    setCurrentUser(user.data);
    const isSuccess = !user?.error;
    if (!isSuccess) {
      showErrorToast(user.error);
      setCurrentUser(null);
    } else {
      setCurrentUser(user.data);
      setInitialName(user.data.name);
    }
  }

  async function fetchUsersWithoutFriendship() {
    const usersWithoutFriendship: Response<User[]> =
      await friendshipsService.getNone(userId);
    const isSuccess = !usersWithoutFriendship?.error;
    if (!isSuccess) {
      showErrorToast(usersWithoutFriendship.error);
    } else {
      const usersAsLabelValue: LabelValue[] = usersWithoutFriendship.data.map(
        (user: User) => {
          return {
            label: `${user.name}`,
            value: user.id,
          };
        }
      );
      setUsers(usersAsLabelValue);
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

  function onCancel() {
    setValue("name", initialName);
  }

  async function onSubmit(data: FieldValues) {
    const responseUser = await usersService.patchUser(userId, data.name);
    const isSuccessUser = !responseUser?.error;
    if (!isSuccessUser) {
      showErrorToast(responseUser?.error);
    } else if (picture) {
      handleOnSubmitPicture();
    }
  }

  async function handleOnSubmitPicture() {
    const formData = new FormData();
    formData.append("file", picture, picture.name);
    const response = await usersService.postUserImage(formData, userId);
    const isSuccess = !response?.error;
    if (!isSuccess) {
      showErrorToast(response.error);
      setImage(null);
    }
  }

  async function onSubmitFriendship(data: FieldValues) {
    const friendsList: User[] | undefined = data.friends?.map(
      (friend: LabelValue) => {
        return {
          id: friend,
        };
      }
    );

    let responseFrienship;
    friendsList?.forEach(async function (friend) {
      responseFrienship = await friendshipsService.postRequest(userId, friend);
      const isSuccessFriendship = !responseFrienship?.error;
      if (!isSuccessFriendship) {
        showErrorToast(responseFrienship?.error);
        return;
      }
    });
  }

  function handleOnChangePicture(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setPicture(e.target.files[0]);
      setImage(e.target.files[0]);
    }
  }

  return (
    <>
      <Navbar />
      <MiniDrawer />
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
                      <Avatar
                        src={image ? URL.createObjectURL(image) : ""}
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      />
                    </Box>
                    <Box className={classes.uploadButtonWrapper}>
                      <Button
                        color="primary"
                        variant="contained"
                        component="label"
                      >
                        {t(translationKeys.updloadPicture)}
                        <Input
                          type="file"
                          sx={{ display: "none" }}
                          onChange={handleOnChangePicture}
                        />
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: "70%",
                      height: "8rem",
                      marginTop: "2rem",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      flexWrap: "no-wrap",
                    }}
                  >
                    <Box className={classes.inputWrapper}>
                      <Box sx={{ width: "100%" }}>
                        <CustomTextField
                          label={"Name"}
                          isRequired
                          name="name"
                          rules={{
                            required: true,
                          }}
                          error={errors.name}
                          register={register}
                        />
                      </Box>
                    </Box>
                    <Box className={classes.buttonsWrapper}>
                      <Button
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                      >
                        {t(translationKeys.buttons.save)}
                      </Button>
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={onCancel}
                      >
                        {t(translationKeys.buttons.cancel)}
                      </Button>
                    </Box>
                  </Box>
                  <Divider
                    sx={{
                      marginTop: "2.5rem",
                      marginBottom: "2.5rem",
                      width: "70%",
                    }}
                  ></Divider>
                  <Box className={classes.multiInputWrapper}>
                    <Box sx={{ width: "100%" }}>
                      <Controller
                        control={control}
                        name="friends"
                        defaultValue={[]}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <CustomMultiSelect
                              label={t(translationKeys.addFriends)}
                              options={users}
                              onChange={onChange}
                              selectedValues={value}
                            />
                          );
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.buttonRequestWrapper}>
                    <Button
                      variant="contained"
                      onClick={handleSubmit(onSubmitFriendship)}
                    >
                      {t(translationKeys.buttons.sendRequest)}
                    </Button>
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
