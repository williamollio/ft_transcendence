import React, { ReactElement } from "react";
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

const CODE_LENGTH = new Array(6).fill(0);

export default function Login2FAView(): ReactElement {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [input, setInput] = React.useState<string[]>(["", "", "", ""]);
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...input];
    newInputs[index] = value.replace(/[^0-9]/g, "").substr(0, 1);
    setInput(newInputs);
  };

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
        type="text"
        inputProps={{ maxLength: 1 }}
        onChange={(e) => handleInputChange(index, e.target.value)}
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
            <Grid alignItems={"stretch"} className={classes.inputWrapper}>
              {CODE_LENGTH.map((v: any, index: number) => {
                return <OTPInputField index={index} key={index} />;
              })}
            </Grid>
            <Button
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
  iconButton: {
    height: "50%",
    width: "50%",
  },
  avatarWrapper: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsWrapper: {
    height: "20%",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1em",
  },
  uploadButtonWrapper: {
    height: "10%",
    width: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "20%",
    width: "45%",
  },
  multiInputWrapper: {
    minHeight: "10%",
    width: "65%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "4rem",
  },
}));
