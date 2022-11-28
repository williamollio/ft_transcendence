import React from "react";
// import { makeStyles } from "tss-react/mui";
import Navbar from "../component/Navbar";
import { Typography } from "@mui/material";

export default function ProfileView(): React.ReactElement {
  //const { classes } = useStyles();
  return (
    <>
      <Navbar />
      <Typography marginTop={"4rem"}>Profile</Typography>
    </>
  );
}

// const useStyles = makeStyles()(() => ({

// }));
