import { ReactElement } from "react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileView from "./views/Profile/ProfileView";
import LoginView from "./views/Login/LoginView";
import Login2FAView from "./views/Login/Login2FAView";
import GameView from "./views/Game/GameView";
import { RoutePath } from "./interfaces/router.interface";
import { TranscendanceContext } from "./context/transcendance-context";
import { TranscendanceStateActionType } from "./context/transcendance-reducer";
import Toast from "./context/toast";
import { Box, ThemeProvider } from "@mui/material";
import theme from "./MuiTheme";
import classes from "./styles.module.scss";
import { useImageStore } from "./store/users-store";

export default function App() {
  const isAuthenticated = true;
  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);

  const imageUrl = image ? URL.createObjectURL(image) : "";

  // removes the object URL after the component unmounts to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const AuthWrapper = ({
    isAuthenticated,
  }: {
    isAuthenticated: boolean;
  }): ReactElement => {
    return isAuthenticated ? (
      <Navigate to={RoutePath.PROFILE} replace />
    ) : (
      <Navigate to={RoutePath.LOGIN_2FA} replace />
    );
  };

  function closeToast() {
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: undefined,
    });
  }

  const { transcendanceState, dispatchTranscendanceState } =
    React.useContext(TranscendanceContext);

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
        display={"flex"}
        flexDirection={"column"}
        minHeight={"100vh"}
        sx={{ backgroundColor: classes.colorSecondary }}
      >
        <ThemeProvider theme={theme}>
          <Routes>
            <Route
              path="/"
              element={<AuthWrapper isAuthenticated={isAuthenticated} />}
            />
            <Route path={RoutePath.LOGIN} element={<LoginView />} />
            <Route path={RoutePath.PROFILE} element={<ProfileView />} />
            <Route path={RoutePath.GAME} element={<GameView />} />
            <Route path={RoutePath.LOGIN_2FA} element={<Login2FAView />} />
          </Routes>
        </ThemeProvider>
      </Box>
    </>
  );
}
