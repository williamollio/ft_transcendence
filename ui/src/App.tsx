import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "./views/Profile/ProfileView";
import LoginView from "./views/Login/LoginView";
import GameView from "./views/Game/GameView";
import { RoutePath } from "./interfaces/router.interface";
import { TranscendanceContext } from "./context/transcendance-context";
import { TranscendanceStateActionType } from "./context/transcendance-reducer";
import Toast from "./context/toast";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import classes from "./styles.module.scss";

export default function App() {
  function closeToast() {
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: undefined,
    });
  }

  const { transcendanceState, dispatchTranscendanceState } =
    React.useContext(TranscendanceContext);

  const theme = createTheme({
    palette: {
      primary: {
        main: classes.colorPrimary,
        light: classes.colorSecondary,
      },
      secondary: {
        main: classes.colorAccent,
      },
    },
    components: {},
  });

  return (
    <>
      {transcendanceState.toast && (
        <Toast
          type={transcendanceState.toast?.type}
          title={transcendanceState.toast?.title}
          message={transcendanceState.toast?.message}
          onClose={closeToast}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#fff1e1",
        }}
      >
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path={RoutePath.LOGIN} element={<LoginView />} />
            <Route path={RoutePath.PROFILE} element={<ProfileView />} />
            <Route path={RoutePath.GAME} element={<GameView />} />
          </Routes>
        </ThemeProvider>
      </Box>
    </>
  );
}
