import { ReactElement } from "react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileView from "./views/Profile/ProfileView";
import LoginView from "./views/Login/LoginView";
import Login2FAView from "./views/Login2FAView";
import GameView from "./views/Game/GameView";
import { RoutePath } from "./interfaces/router.interface";
import { TranscendanceContext } from "./context/transcendance-context";
import { TranscendanceStateActionType } from "./context/transcendance-reducer";
import Toast from "./context/toast";
import { Box, ThemeProvider } from "@mui/material";
import theme from "./MuiTheme";
import classes from "./styles.module.scss";
import { useImageStore } from "./store/users-store";
import { PrivateRoute } from "./components/PrivateRoute";
import { getIsAuthenticated, initAuthToken } from "./utils/auth-helper";

export default function App() {
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

  const AuthWrapper = (): ReactElement => {
    const isAuthenticated = getIsAuthenticated();
    return isAuthenticated ? (
      <Navigate to={RoutePath.PROFILE} replace />
    ) : (
      <Navigate to={RoutePath.LOGIN} replace />
    );
  };

  const RedirectWrapper = () => {
    initAuthToken();
    return (
      <Navigate to={RoutePath.PROFILE} state={{ editMode: false }}></Navigate>
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
            <Route path="*" element={<AuthWrapper />} />
            <Route path={RoutePath.LOGIN} element={<LoginView />} />
            <Route
              path={RoutePath.REDIRECT}
              element={
                <PrivateRoute>
                  <RedirectWrapper />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.PROFILE}
              element={
                <PrivateRoute>
                  <ProfileView />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.GAME}
              element={
                <PrivateRoute>
                  <GameView />
                </PrivateRoute>
              }
            />
            <Route path={RoutePath.LOGIN_2FA} element={<Login2FAView />} />
          </Routes>
        </ThemeProvider>
      </Box>
    </>
  );
}
