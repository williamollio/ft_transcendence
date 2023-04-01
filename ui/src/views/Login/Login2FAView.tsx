import React, { ReactElement, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import { Typography, Button, Grid, TextField, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import {
  Background,
  CardContainer,
  ProfileCard,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";
import authService from "../../services/auth.service";
import { RoutePath } from "../../interfaces/router.interface";
import { useNavigate } from "react-router-dom";
import { TranscendanceContext } from "../../context/transcendance-context";
import { AxiosError } from "axios";
import { ToastType } from "../../context/toast";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";

const CODE_LENGTH = 6; // number of input fields to render

export default function Login2FAView(): ReactElement {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [input, setInput] = React.useState<string[]>(
    Array(CODE_LENGTH).fill("")
  );
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const inputRefs = useRef<any>([]);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (index: number, value: string) => {
    setCurrentIndex(index);
    const newInputs = [...input];
    newInputs[index] = value.replace(/[^0-9]/g, "").substr(0, 1);
    setInput(newInputs);
  };

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

  async function handleSubmit() {
    const response = await authService.sendSecondFactor(input);
    if (!response.error) {
      navigate(RoutePath.EDITPROFILE);
    } else {
      showErrorToast(response.error);
    }
  }

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
              {t(translationKeys.login2fa)}
            </Typography>
          </TitleWrapper>
          <ContentWrapper>
            <Grid className={classes.inputWrapper}>
              {Array(CODE_LENGTH)
                .fill(0)
                .map((v: any, index: number) => {
                  return <OTPInputField index={index} key={index} />;
                })}
            </Grid>
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
                id="submit-button"
                onClick={() => handleSubmit()}
                sx={{ width: "100px", height: "50px" }}
                variant="contained"
              >
                {t(translationKeys.buttons.submit)}
              </Button>
            </Box>
          </ContentWrapper>
        </CardContainer>
      </ProfileCard>
    </Background>
  );
}

const useStyles = makeStyles()(() => ({
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    height: "20%",
    width: "45%",
  },
}));
