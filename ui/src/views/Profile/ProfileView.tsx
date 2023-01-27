import React, { ChangeEvent, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../../components/Navbar";
import { Box, Button, Typography, Input, Avatar } from "@mui/material";
import usersService from "../../services/users.service";
import { UserCreation, User, Friends } from "../../interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import { idTabs } from "../../interfaces/tab.interface";
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

const isEditMode = true;

export default function ProfileView(): React.ReactElement {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [picture, setPicture] = useState<any>();
  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);
  const [users, setUsers] = useState<LabelValue[]>([]);

  const id = "61";
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
    fetchUsers();
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    const currentUser = (await usersService.getUser(id)).data;

    for (const property in currentUser) {
      if (property === "name") {
        setValue(property, currentUser.name);
      } else if (property === "friends") {
        const friendsIds: number[] | undefined = currentUser.friends?.map(
          (friend: Friends) => friend.id
        );
        setValue(property, friendsIds);
      }
    }
  }

  async function fetchUsers() {
    const usersResponse: Response<User[]> = await usersService.getUsers();
    const usersAsLabelValue: LabelValue[] = usersResponse.data.map(
      (user: User) => {
        return {
          label: `${user.name}`,
          value: user.id,
        };
      }
    );
    setUsers(usersAsLabelValue);
  }

  function navigateToGamePage() {
    navigate(RoutePath.GAME, { state: { activeTabId: idTabs.GAME } });
  }

  async function handleOnSubmitPicture(name: string) {
    let response;
    const formData = new FormData();
    formData.append("file", picture, picture.name);
    response = await usersService.postUserImage(formData, name);
    const isSuccess = !response?.error;
    if (!isSuccess) {
      showErrorToast(response.error);
    }
  }

  async function handleOnSaveUser(data: FieldValues) {
    let responseUser;

    const friendsList: Friends[] | undefined = data.friends?.map(
      (friend: LabelValue) => {
        return {
          id: friend,
        };
      }
    );

    const userCreation: UserCreation = {
      name: data.name,
      friends: friendsList,
    };

    if (isEditMode) {
      responseUser = await usersService.patchUser(id, userCreation);
    } else {
      responseUser = await usersService.postUser(userCreation);
    }

    const isSuccessUser = !responseUser?.error;
    if (isSuccessUser) {
      navigateToGamePage();
    } else {
      showErrorToast(responseUser.error);
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

  async function onSubmit(data: FieldValues) {
    handleOnSaveUser(data);
    if (picture) {
      handleOnSubmitPicture(data.name);
    }
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
                  variant="contained"
                  component="label"
                  className={classes.iconButton}
                >
                  {t(translationKeys.updloadPicture)}
                  <Input
                    type="file"
                    sx={{ display: "none" }}
                    onChange={handleOnChangePicture}
                  />
                </Button>
              </Box>
              <Box className={classes.inputWrapper}>
                <Box sx={{ width: "100%" }}>
                  <CustomTextField
                    label={"Choose a name"}
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
              <Box className={classes.buttonsWrapper}>
                <Button
                  className={classes.iconButton}
                  variant="outlined"
                  onClick={handleSubmit(onSubmit)}
                >
                  {t(translationKeys.buttons.save)}
                </Button>
                {isEditMode && (
                  <Button className={classes.iconButton} variant="outlined">
                    {t(translationKeys.buttons.cancel)}
                  </Button>
                )}
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
  iconButton: {
    height: "50%",
    width: "50%",
  },
  avatarWrapper: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsWrapper: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1em",
  },
  uploadButtonWrapper: {
    height: "10%",
    width: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "20%",
    width: "60%",
  },
  multiInputWrapper: {
    minHeight: "10%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "4rem",
  },
}));
