import React, { ChangeEvent, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../component/Navbar";
import {
  Box,
  TextField,
  Button,
  Typography,
  Input,
  Avatar,
  Autocomplete,
} from "@mui/material";
import usersService from "../service/users.service";
import { UserCreation, User } from "../interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../interfaces/router.interface";
import { idTabs } from "../interfaces/tab.interface";
import { AxiosError } from "axios";
import { TranscendanceContext } from "../context/transcendance-context";
import { ToastType } from "../context/toast";
import { TranscendanceStateActionType } from "../context/transcendance-reducer";
import { Response } from "../service/common/resolve";
import { LabelValue } from "../interfaces/common.interface";

const isEditMode = false; // TO DO

export default function ProfileView(): React.ReactElement {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const [users, setUsers] = useState<LabelValue[]>([]);

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

  async function handleOnSavePicture() {
    let response;
    const formData = new FormData();
    formData.append("file", picture, picture.name);
    response = await usersService.postUserImage(formData);
    const isSuccess = !response?.error;
    if (!isSuccess) {
      showErrorToast(response.error);
    }
  }
  async function handleOnSaveName() {
    let response;
    const userCreation: UserCreation = { name: name };
    response = await usersService.postUser(userCreation);
    const isSuccess = !response?.error;
    if (isSuccess) {
      navigateToGamePage();
    } else {
      showErrorToast(response.error);
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
    if (picture) {
      handleOnSavePicture();
    }
    if (name !== "") {
      handleOnSaveName();
    }
  }

  function handleOnChangeName(name: string) {
    setName(name);
  }

  function handleOnChangePicture(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setPicture(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  }

  return (
    <>
      <Navbar />
      <Box className={classes.containerProfile}>
        <Box className={classes.boxProfile}>
          <Box className={classes.wrapperProfile}>
            <Box className={classes.wrapperTile}>
              <Typography
                variant="h4"
                color={"#d2601a"}
                fontWeight={"bold"}
                sx={{ textDecoration: "underline" }}
              >
                Profile
              </Typography>
            </Box>
            <Box className={classes.wrapperContent}>
              <Box className={classes.wrapperPicture30}>
                <Avatar
                  id="profile-picture"
                  src={avatar}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                />
              </Box>
              <Box className={classes.wrapperPicture20}>
                <Button
                  variant="contained"
                  component="label"
                  className={classes.iconButton}
                >
                  Upload Picture
                  <Input
                    type="file"
                    sx={{ display: "none" }}
                    onChange={handleOnChangePicture}
                  />
                </Button>
              </Box>
              <Box className={classes.wrapperInputName}>
                <TextField
                  className={classes.inputName}
                  value={name}
                  name={"name"}
                  variant="outlined"
                  onChange={(event) => {
                    handleOnChangeName(event.target.value);
                  }}
                  label="Choose an unique name"
                ></TextField>
              </Box>
              <Box className={classes.wrapperMultiselect}>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={users}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Add friends"
                    />
                  )}
                />
              </Box>
              <Box className={classes.buttons}>
                <Button
                  className={classes.iconButton}
                  variant="outlined"
                  onClick={() => handleOnSave()}
                >
                  Save
                </Button>
                {isEditMode && (
                  <Button className={classes.iconButton} variant="outlined">
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  containerProfile: {
    marginTop: "4rem",
    border: "1px",
    width: "100%",
    height: "calc(100vh - 4rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  boxProfile: {
    background: "#fff1e1",
    borderRadius: "50px",
    boxShadow: "46px 46px 92px #b3a99e, -46px -46px 92px #ffffff",
    height: "35rem",
    width: "45rem",
    marginBottom: "10rem",
  },
  wrapperProfile: {
    height: "100%",
    width: "100%",
  },
  wrapperTile: {
    height: "20%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
  },
  wrapperContent: {
    height: "80%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "top",
    gap: "1rem",
    flexDirection: "column",
  },
  wrapperPicture20: {
    height: "15%",
    width: "60%",
    display: "flex",
    justifyContent: "center",
  },
  wrapperPicture30: {
    height: "30%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
  },
  wrapperInputName: {
    height: "20%",
    width: "50%",
  },
  wrapperMultiselect: {
    height: "20%",
    width: "70%",
  },
  buttons: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    gap: "1em",
  },
  iconButton: {
    height: "50%",
    width: "50%",
  },
  inputName: {
    width: "100%",
    height: "100%",
    borderRadius: "100px",
  },
}));
