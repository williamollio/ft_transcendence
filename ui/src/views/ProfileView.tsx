import React from "react";
import { makeStyles } from "tss-react/mui";
import Navbar from "../component/Navbar";

export default function ProfileView(): React.ReactElement {
  const { classes } = useStyles();
  return (
    <>
      <Navbar />
      <div> Profile </div>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  menuBar: {
    height: "4rem",
    width: "100%",
    backgroundColor: "#1d3c45",
  },
}));
