import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../component/Navbar";
import { Box, TextField, Button, Typography, Input } from "@mui/material";

export default function ProfileView(): React.ReactElement {
  const { classes } = useStyles();
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<any>();

  function handleOnChangeName(name: string) {
    setName(name);
  }

  function handleOnChangePicture(picture: any) {
    setPicture(picture);
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
                      handleOnChangePicture(event.target.value);
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
