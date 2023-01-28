import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import authService from "../../services/auth.service";

export default function LoginView(): React.ReactElement {
  const { t } = useTranslation();

  const handleLogin = () => {
    window.open(authService.createAuthURI(), "_self");
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        sx={{ width: "100px", height: "50px" }}
        variant="contained"
        onClick={() => handleLogin()}
      >
        {t(translationKeys.buttons.login)}
      </Button>
    </Box>
  );
}
