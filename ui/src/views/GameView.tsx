import React from "react";
import Navbar from "../component/Navbar";
import { Box, Typography } from "@mui/material";

export default function LoginView(): React.ReactElement {
  return (
    <>
      <Navbar />
      <Typography marginTop={"4rem"}>Game</Typography>
    </>
  );
}
