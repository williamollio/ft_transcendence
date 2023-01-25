import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import {getBaseUrl} from "../../utils/url-helper";

export default function LoginView(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    // send request to BE
    window.open(`${getBaseUrl()}auth/intra42`, '_self');
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
