import React from "react";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import { Box } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../interfaces/router.interface";

export default function LoginView(): React.ReactElement {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const handleLogin = () => {
    /*
     * const response = somehow_call_the_backend();
     * if (response.2fa) {
     *   navigate(RoutePath.LOGIN_2FA);
     * } else {
     */
    navigate(RoutePath.PROFILE);
    // }
  };
  return (
    <Box className={classes.containerLogin}>
      <Button
        className={classes.login}
        variant="contained"
        onClick={() => handleLogin()}
      >
        Login
      </Button>
    </Box>
  );
}

const useStyles = makeStyles()(() => ({
  containerLogin: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  login: {
    width: "100px",
    height: "50px",
  },
}));
