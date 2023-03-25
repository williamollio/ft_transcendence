import React, { useRef } from "react";
import Navbar from "../../components/Navbar";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import {
  Background,
  ProfileCard,
  CardContainer,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import LeftDrawer from "../../components/LeftDrawer/LeftDrawer";
import { Cookie, getTokenData } from "../../utils/auth-helper";
import { RoutePath } from "../../interfaces/router.interface";
import usersService from "../../services/users.service";
import { AxiosError } from "axios";
import { ToastType } from "../../context/toast";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { TranscendanceContext } from "../../context/transcendance-context";
import authService from "../../services/auth.service";

const CODE_LENGTH = 6; // number of input fields to render

export default function Setup2FA(): React.ReactElement {
  const navigate = useNavigate();
  const [QRCodeUrl, setQRCodeUrl] = React.useState<string>("");
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [input, setInput] = React.useState<string[]>(
    Array(CODE_LENGTH).fill("")
  );
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const inputRefs = useRef<any>([]);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<string>("");
  const handleInputChange = (index: number, value: string) => {
    setCurrentIndex(index);
    const newInputs = [...input];
    newInputs[index] = value.replace(/[^0-9]/g, "").substr(0, 1);
    setInput(newInputs);
  };
  const [token] = React.useState<string | null>(
    localStorage.getItem(Cookie.TOKEN)
  );
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [is2faEnabled, setIs2faEnabled] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (token === null) {
      navigate(RoutePath.LOGIN);
    } else {
      setUserId(getTokenData(token).id);
      if (userId) {
        fetchCurrentUser();
      }
    }
  }, [userId]);

  function showErrorToast(error?: AxiosError) {
    const message = error?.response?.data as any;
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.ERROR,
        title: "Error",
        message: message,
      },
    });
  }

  function showSuccessToast(message: void) {
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.SUCCESS,
        title: "Success",
        message: message as unknown as string,
      },
    });
  }

  async function fetchCurrentUser() {
    const user = await usersService.getUser(userId);
    const isSuccess = !user?.error;
    if (!isSuccess) {
      showErrorToast(user.error);
      setIs2faEnabled(undefined);
    } else {
      setIs2faEnabled(user.data.secondFactorEnabled);
    }
  }

  React.useEffect(() => {
    const nextIndex = currentIndex + 1;

    if (input.every((str) => str === "") && isFocused === false) {
      inputRefs.current[0].focus();
      setIsFocused(true);
      return;
    }
    if (nextIndex < CODE_LENGTH && input[currentIndex] != "") {
      inputRefs.current[nextIndex].focus();
      inputRefs.current[nextIndex].select();
      return;
    } else if (nextIndex === CODE_LENGTH || input.every((str) => str != "")) {
      document.getElementById("submit-button")?.focus();
      return;
    } else {
      inputRefs.current[currentIndex].focus();
      inputRefs.current[currentIndex].select();
      return;
    }
  }, [input, isFocused]);

  function onCancelCode() {
    navigate(-1);
  }
  async function trigger2fa() {
    let response;
    if (is2faEnabled) {
      response = await authService.disableSecondFactor();
    } else {
      response = await authService.activateSecondFactor();
      if (response.data !== "") {
        setQRCodeUrl(response.data);
      }
    }
    setIs2faEnabled(!is2faEnabled);
    // if (response.error) {
    //   showErrorToast(response.error);
    // }
  }

  async function onSubmitCode() {
    if (!QRCodeUrl) {
      return;
    }
    const responseSend2fa = await authService.sendSecondFactor(input);
    if (!responseSend2fa.error) {
      showSuccessToast(responseSend2fa.data);
      setQRCodeUrl("");
    } else {
      showErrorToast(responseSend2fa.error);
    }
    setInput(Array(CODE_LENGTH).fill(""));
  }

  const OTPInputField = ({ index }: { index: number }) => {
    return (
      <TextField
        name={`textfield-${index}`}
        type="text"
        onChange={(e) => handleInputChange(index, e.target.value)}
        inputProps={{ maxLength: 1 }}
        inputRef={(ref) => (inputRefs.current[index] = ref)}
        value={input[index]}
      ></TextField>
    );
  };

  return (
    <>
      <Navbar />
      <LeftDrawer />
      <Background>
        <ProfileCard>
          <CardContainer>
            <TitleWrapper>
              <Typography
                variant="h4"
                color={"secondary"}
                fontWeight={"bold"}
                sx={{ textDecoration: "underline" }}
              >
                {t(translationKeys.setup2fa)}
              </Typography>
            </TitleWrapper>
            <ContentWrapper>
              <Typography
                variant="h5"
                color={"primary"}
                fontWeight={"bold"}
                mt="30px"
              >
                {t(translationKeys.enterNumber)}
              </Typography>
              <Box
                sx={{
                  minWidth: "40%",
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {QRCodeUrl && <img src={QRCodeUrl} />}
              </Box>
              <Box
                sx={{ width: "92% !important" }}
                className={classes.buttonsWrapper}
              >
                {is2faEnabled === undefined ? (
                  <CircularProgress size={24} />
                ) : (
                  <Button
                    variant="contained"
                    className={classes.iconButton}
                    color="primary"
                    onClick={trigger2fa}
                  >
                    {is2faEnabled
                      ? t(translationKeys.buttons.disable)
                      : t(translationKeys.buttons.enable)}
                  </Button>
                )}
              </Box>
              <Grid className={classes.inputWrapper}>
                {Array(CODE_LENGTH)
                  .fill(0)
                  .map((v: any, index: number) => {
                    return <OTPInputField index={index} key={index} />;
                  })}
              </Grid>
              <Box className={classes.buttonsWrapper}>
                <Button
                  id="submit-button"
                  className={classes.iconButton}
                  variant="contained"
                  color="primary"
                  onClick={onSubmitCode}
                >
                  {t(translationKeys.buttons.submit)}
                </Button>
                <Button
                  className={classes.iconButton}
                  variant="outlined"
                  onClick={onCancelCode}
                >
                  {t(translationKeys.buttons.cancel)}
                </Button>
              </Box>
            </ContentWrapper>
          </CardContainer>
        </ProfileCard>
      </Background>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  iconButton: {
    height: "30%",
    width: "30%",
  },
  buttonsWrapper: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1em",
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    height: "20%",
    width: "45%",
  },
}));
