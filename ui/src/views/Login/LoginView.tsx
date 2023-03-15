import React from "react";
import { TranscendanceContext } from "../../context/transcendance-context";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import { Cookie, getTokenData } from "../../utils/auth-helper";
import CustomTextField from "../../components/shared/CustomTextField/CustomTextField";
import usersService from "../../services/users.service";
import { AxiosError } from "axios";
import { ToastType } from "../../context/toast";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";

export default function LoginView(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const { handleSubmit, register } = useForm({
    mode: "onChange",
  });

  React.useEffect(() => {
    const token = localStorage.getItem(Cookie.TOKEN);
    if (token !== null) {
      navigate(RoutePath.PROFILE);
    }
  }, []);

  const handleLogin42 = () => {
    window.open(authService.getAuthURI(), "_self");
  };

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

  async function handleLoginToken(data: FieldValues) {
    localStorage.setItem(Cookie.TOKEN, data.token);
    const { id } = getTokenData(data.token);
    const response = await usersService.getUser(id.toString());
    const isSuccess = !response?.error;
    if (!isSuccess) {
      showErrorToast(response.error);
      localStorage.removeItem(Cookie.TOKEN);
    } else {
      navigate(RoutePath.PROFILE);
    }
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "22rem",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Button
          sx={{ width: "190px", height: "45px" }}
          variant="contained"
          onClick={() => handleLogin42()}
        >
          {t(translationKeys.buttons.login42)}
        </Button>
      </Box>
      <Typography>{t(translationKeys.or)}</Typography>
      <Box
        sx={{
          display: "flex",
          width: "22rem",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <CustomTextField
            isRequired
            name="token"
            label={t(translationKeys.loginToken) as string}
            register={register}
          ></CustomTextField>
        </Box>
        <Button
          sx={{ width: "100px", height: "45px" }}
          variant="contained"
          onClick={handleSubmit(handleLoginToken)}
        >
          {t(translationKeys.buttons.save)}
        </Button>
      </Box>
    </Box>
  );
}
