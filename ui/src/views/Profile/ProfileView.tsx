import React, { ChangeEvent, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../../components/Navbar";
import {
  Box,
  TextField,
  Button,
  Typography,
  Input,
  Avatar,
  Autocomplete,
} from "@mui/material";
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

const isEditMode = false; // TO DO

export default function ProfileView(): React.ReactElement {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<any>();
  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);
  const [users, setUsers] = useState<LabelValue[]>([]);
  const [friends, setFriends] = useState<LabelValue[] | undefined>(undefined);

  React.useEffect(() => {
    fetchUsers();
  }, []);

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

  async function handleOnSavePicture(name: string) {
    let response;
    const formData = new FormData();
    formData.append("file", picture, picture.name);
    response = await usersService.postUserImage(formData, name);
    const isSuccess = !response?.error;
    if (!isSuccess) {
      showErrorToast(response.error);
    }
  }
  async function handleOnSaveUserCreation() {
    let responseUser;

    const friendsList: Friends[] | undefined = friends?.map((friend) => {
      return {
        id: friend.value,
      };
    });

    const userCreation: UserCreation = {
      name: name,
      friends: friendsList,
    };

    responseUser = await usersService.postUser(userCreation);

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

  async function handleOnSave() {
    if (isEditMode) {
      // usersService.patchUser() // TO DO
    }

    if (name !== "") {
      handleOnSaveUserCreation();
      if (picture) {
        handleOnSavePicture(name);
      }
    }
  }

  function handleOnChangeName(name: string) {
    setName(name);
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
              <Box sx={{ height: "20%", width: "50%" }}>
                <TextField
                  sx={{ height: "100%", borderRadius: "100px" }}
                  fullWidth
                  value={name}
                  name={"name"}
                  variant="outlined"
                  onChange={(event) => {
                    handleOnChangeName(event.target.value);
                  }}
                  label={t(translationKeys.chooseName)}
                ></TextField>
              </Box>
              <Box sx={{ height: "20%", width: "70%" }}>
                <Autocomplete
                  value={friends}
                  onChange={(
                    event: any,
                    newValue: LabelValue[] | undefined
                  ) => {
                    setFriends(newValue);
                  }}
                  multiple
                  options={users}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={t(translationKeys.addFriends)}
                    />
                  )}
                />
              </Box>
              <Box className={classes.buttonsWrapper}>
                <Button
                  className={classes.iconButton}
                  variant="outlined"
                  onClick={() => handleOnSave()}
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
    height: "30%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
  },
  buttonsWrapper: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    gap: "1em",
  },
  uploadButtonWrapper: {
    height: "15%",
    width: "60%",
    display: "flex",
    justifyContent: "center",
  },
}));
