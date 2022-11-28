import React from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../component/Navbar";
import { Box, Typography } from "@mui/material";

export default function ProfileView(): React.ReactElement {
  const { classes } = useStyles();
  return (
    <>
      <Navbar />
      <Box className={classes.containerGame}>
        <Box className={classes.boxGame}>
          <Box className={classes.wrapperProfile}>
            <Box className={classes.wrapperTile}>
              <Typography variant="h4" color={"#d2601a"} fontWeight={"bold"} sx={{textDecoration : "underline"}}>
                Game
              </Typography>
            </Box>
            <Box className={classes.wrapperText}>
              <Typography></Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  containerGame: {
    marginTop: "4rem",
    border: "1px",
    width: "100%",
    height: "calc(100vh - 4rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  boxGame: {
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
	marginTop : "10px"
  },
  wrapperText: {
    height: "80%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
