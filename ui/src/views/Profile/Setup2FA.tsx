import React, { useRef } from "react";
import Navbar from "../../components/Navbar";
import { Box, Button, Grid, Typography } from "@mui/material";
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
import CustomTextField from "../../components/shared/CustomTextField/CustomTextField";
import { useForm, FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import MiniDrawer from "../../components/LeftDrawer/MiniDrawer";

const CODE_LENGTH = 6; // number of input fields to render

export default function Setup2FA(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });
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

  function onCancelPhone() {
    navigate(-1);
  }

  function onCancelCode() {
    console.log("to implement");
  }
  async function onSubmitPhone(data: FieldValues) {
    console.log("data.phoneNumber " + data.phoneNumber);
  }

  async function onSubmitCode() {
    console.log("input " + input);
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
      <MiniDrawer />
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
              <Box sx={{ width: "40%", marginTop: "50px" }}>
                <CustomTextField
                  label={"Phone number"}
                  isRequired
                  name="phoneNumber"
                  rules={{
                    required: true,
                  }}
                  error={errors.phoneNumber}
                  register={register}
                />
              </Box>
              <Box className={classes.buttonsWrapper}>
                <Button
                  variant="contained"
                  className={classes.iconButton}
                  color="primary"
                  onClick={handleSubmit(onSubmitPhone)}
                >
                  {t(translationKeys.buttons.save)}
                </Button>
                <Button
                  className={classes.iconButton}
                  variant="outlined"
                  onClick={onCancelPhone}
                >
                  {t(translationKeys.buttons.cancel)}
                </Button>
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
