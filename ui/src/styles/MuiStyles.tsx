import { styled } from "@mui/material";
import { Box } from "@mui/material";

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
