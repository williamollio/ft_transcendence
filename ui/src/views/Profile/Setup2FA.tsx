import React from "react";
import Navbar from "../../components/Navbar";
import { Box, Button, Typography } from "@mui/material";
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

  function onCancel() {
    navigate(-1);
  }
  async function onSubmit(data: FieldValues) {
    console.log("data.phoneNumber " + data.phoneNumber);
  }

  const { classes } = useStyles();
  return (
    <>
      <Navbar />
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
                  className={classes.iconButton}
                  variant="outlined"
                  onClick={handleSubmit(onSubmit)}
                >
                  {t(translationKeys.buttons.save)}
                </Button>
                <Button
                  className={classes.iconButton}
                  variant="outlined"
                  onClick={onCancel}
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
}));
