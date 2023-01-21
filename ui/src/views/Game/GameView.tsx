import React from "react";
import Navbar from "../../components/Navbar";
import { Box, Typography } from "@mui/material";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import { Background } from "../../styles/MuiStyles";

export default function ProfileView(): React.ReactElement {
  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <>
      <Navbar />
      <Background>
        <Box
          sx={{
            background: "#fff1e1",
            borderRadius: "50px",
            boxShadow: "46px 46px 92px #b3a99e, -46px -46px 92px #ffffff",
            height: "25rem",
            width: "40rem",
            marginBottom: "10rem",
          }}
        >
          <Box sx={{ height: "100%", width: "100%" }}>
            <Box
              sx={{
                height: "20%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Typography
                variant="h4"
                color={"#d2601a"}
                fontWeight={"bold"}
                sx={{ textDecoration: "underline" }}
              >
                {t(translationKeys.game)}
              </Typography>
            </Box>
            <Box
              sx={{
                height: "80%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography></Typography>
            </Box>
          </Box>
        </Box>
      </Background>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  wrapperCard: {
    marginTop: "4rem",
    border: "1px",
    width: "100%",
    height: "calc(100vh - 4rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputName: {},
}));
