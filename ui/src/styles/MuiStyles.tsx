import { styled } from "@mui/material";
import { Box } from "@mui/material";
import classes from "../styles.module.scss";

export const Background = styled(Box)({});
Background.defaultProps = {
  marginTop: "4rem",
  border: "1px",
  width: "100%",
  height: "calc(100vh - 4rem)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const ProfileCard = styled(Box)({});
ProfileCard.defaultProps = {
  borderRadius: "50px",
  boxShadow: "46px 46px 92px #b3a99e, -46px -46px 92px #ffffff",
  height: "48rem",
  width: "60rem",
  marginBottom: "2rem",
  bgcolor: classes.colorSecondary,
};

export const CardContainer = styled(Box)({});
CardContainer.defaultProps = {
  width: "100%",
  height: "100%",
};

export const TitleWrapper = styled(Box)({});
TitleWrapper.defaultProps = {
  height: "10%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const ContentWrapper = styled(Box)({});
ContentWrapper.defaultProps = {
  height: "80%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
};
