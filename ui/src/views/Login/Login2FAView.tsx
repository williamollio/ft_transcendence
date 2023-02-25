import React, { ReactElement, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import { Typography, Button, Grid, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import {
  Background,
  CardContainer,
  ProfileCard,
  TitleWrapper,
  ContentWrapper,
} from "../../styles/MuiStyles";

const CODE_LENGTH = 6; // number of input fields to render

export default function Login2FAView(): ReactElement {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [input, setInput] = React.useState<string[]>(
    Array(CODE_LENGTH).fill("")
  );

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const inputRefs = useRef<any>([]);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

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
    console.log("send input array " + input);
    // TODO: New strategy!
    //          - mhahnFr
    /*let response = await AuthService.getAuthURI(); // <- Will be changed later on.
    if (!response?.error) {
      navigate(RoutePath.PROFILE);
    } else {
      navigate(RoutePath.LOGIN);
    }*/
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
            <Button
              id="submit-button"
              onClick={() => handleSubmit()}
              sx={{ width: "100px", height: "50px" }}
              variant="contained"
            >
              {t(translationKeys.buttons.submit)}
            </Button>
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
