import React, { ChangeEvent, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../component/Navbar";
import { Box, TextField, Button, Typography, Input } from "@mui/material";
import usersService from "../service/users.service";
import { UserCreation } from "../interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../interfaces/router.interface";
import { idTabs } from "../interfaces/tab.interface";

const isEditMode = false; // TO DO

interface HandlePictureChangeInterface {
  target: HTMLInputElement | HTMLTextAreaElement;
}

export default function ProfileView(): React.ReactElement {
  const { classes } = useStyles();
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<any>();
  const [targetPicture, setTargetPicture] = useState<any>();
  const navigate = useNavigate();

  function navigateToGamePage() {
    navigate(RoutePath.GAME, { state: { activeTabId: idTabs.GAME } });
  }

  async function handleOnSave() {
    let response;
    if (picture) {
      const formData = new FormData();
      formData.append("picture", picture, picture.name);
    }
    if (isEditMode) {
      // usersService.patchUser() // TO DO
    } else {
      const userCreation: UserCreation = { name: name };
      response = await usersService.postUser(userCreation);
    }
    const isSuccess = !response?.error;
    if (isSuccess) {
      navigateToGamePage();
    } else {
      console.error("an error has occurred"); // TO DO
    }
  }

  function handleOnChangeName(name: string) {
    setName(name);
  }

  function handleOnChangePicture(event: HandlePictureChangeInterface) {
    setTargetPicture(event.target);
    if (targetPicture && targetPicture !== 0) {
      setPicture(targetPicture[0]);
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
              <Typography></Typography>
              <Box className={classes.wrapperPicture}>
                <Button
                  variant="contained"
                  component="label"
                  className={classes.iconButton}
                >
                  Upload Picture
                  <Input
                    type="file"
                    sx={{ display: "none" }}
                    value={picture}
                    onChange={(event) => {
                      handleOnChangePicture(event);
                    }}
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
    height: "25rem",
    width: "40rem",
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
  wrapperPicture: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
  },
  wrapperInputName: {
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
