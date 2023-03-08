import { ReactElement, useEffect, useState } from "react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileView from "./views/Profile/ProfileView";
import Setup2FA from "./views/Profile/Setup2FA";
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
import { PrivateRoute } from "./components/PrivateRoute";
import { getIsAuthenticated, initAuthToken } from "./utils/auth-helper";
import { UserSocket } from "./classes/UserSocket.class";
import { ChannelSocket } from "./classes/ChannelSocket.class";

export default function App() {
  const [userSocket] = useState<UserSocket>(new UserSocket());
  const [channelSocket] = useState<ChannelSocket>(new ChannelSocket());
  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);
  const imageUrl = image ? URL.createObjectURL(image) : "";

  // different method to initialize out sockets that makes them persistent over all views
  React.useEffect(() => {
    if (userSocket.socket.connected === false) {
      let userToken: {
        [key: string]: any;
      } = userSocket.socket.auth;
      if (userToken.token !== "") {
        userSocket.socket.connect();
        userSocket.logIn();
      }
    }
    if (channelSocket.socket.connected === false) {
      let channelToken: {
        [key: string]: any;
      } = channelSocket.socket.auth;
      if (channelToken.token !== "") {
        channelSocket.socket.connect();
      }
    }
  }, [userSocket.socket.auth, channelSocket.socket.auth]);

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
                  <ProfileView userSocket={userSocket} />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.GAME}
              element={
                <PrivateRoute>
                  <GameView
                    userSocket={userSocket}
                    channelSocket={channelSocket}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.SETUP2FA}
              element={
                <PrivateRoute>
                  <Setup2FA />
                </PrivateRoute>
              }
            />
            <Route path={RoutePath.LOGIN_2FA} element={<Login2FAView />} />{" "}
            {/* TODO : William Private ? */}
          </Routes>
        </ThemeProvider>
      </Box>
    </>
  );
}
