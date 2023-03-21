import { ReactElement, useState } from "react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileView from "./views/Profile/ProfileView";
import Setup2FA from "./views/Profile/Setup2FA";
import LoginView from "./views/Login/LoginView";
import Login2FAView from "./views/Login/Login2FAView";
import ChatView from "./views/Chat/ChatView";
import { RoutePath } from "./interfaces/router.interface";
import { TranscendanceContext } from "./context/transcendance-context";
import { TranscendanceStateActionType } from "./context/transcendance-reducer";
import Toast from "./context/toast";
import { Box, ThemeProvider } from "@mui/material";
import theme from "./MuiTheme";
import classes from "./styles.module.scss";
import { useImageStore } from "./store/users-store";
import { PrivateRoute } from "./components/PrivateRoute";
import { Cookie, getIsAuthenticated, initAuthToken } from "./utils/auth-helper";
import { UserSocket } from "./classes/UserSocket.class";
import { ChannelSocket } from "./classes/ChannelSocket.class";
import GameView from "./views/Game/GameView";
import StatsView from "./views/Stats/StatsView";
import { GameSocket } from "./classes/GameSocket.class";

export default function App() {
  const [userSocket] = useState<UserSocket>(new UserSocket());
  const [channelSocket] = useState<ChannelSocket>(new ChannelSocket());
  const [gameSocket] = useState<GameSocket>(new GameSocket());

  const [token, setToken] = useState<boolean>(false);

  const [image, setImage] = useImageStore(
    (state: { image: any; setImage: any }) => [state.image, state.setImage]
  );
  const imageUrl = image ? URL.createObjectURL(image) : "";

  // different method to initialize out sockets that makes them persistent over all views
  React.useEffect(() => {
    if (token) {
      let gotToken = localStorage.getItem(Cookie.TOKEN);
      if (gotToken !== "") {
        gotToken = "Bearer " + gotToken;
        if (userSocket.socket.connected === false) {
          userSocket.socket.auth = { token: gotToken };
          userSocket.socket.connect();
          userSocket.logIn();
        }
        if (channelSocket.socket.connected === false) {
          channelSocket.socket.auth = { token: gotToken };
          channelSocket.initializeName(gotToken);
          channelSocket.socket.connect();
        }
        if (gameSocket.socket.connected === false) {
          gameSocket.socket.auth = { token: gotToken };
          gameSocket.socket.connect();
        }
      }
    }
    return () => {
      if (userSocket.socket.connected) userSocket.socket.disconnect();
      if (channelSocket.socket.connected) channelSocket.socket.disconnect();
      if (gameSocket.socket.connected) gameSocket.socket.disconnect();
    };
  }, [token, channelSocket, userSocket, gameSocket]);

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
      <Navigate
        to={RoutePath.PROFILE}
        state={{ creationMode: true }}
      ></Navigate>
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
        height={"100vh"}
        width={"100vw"}
        sx={{ backgroundColor: classes.colorSecondary }}
      >
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="*" element={<AuthWrapper />} />
            <Route path={RoutePath.LOGIN} element={<LoginView />} />
            <Route
              path={RoutePath.REDIRECT}
              element={
                <PrivateRoute
                  children={<RedirectWrapper />}
                  setToken={setToken}
                ></PrivateRoute>
              }
            />
            <Route
              path={RoutePath.PROFILE}
              element={
                <PrivateRoute setToken={setToken}>
                  <ProfileView />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.CHAT}
              element={
                <PrivateRoute setToken={setToken}>
                  <ChatView
                    userSocket={userSocket}
                    channelSocket={channelSocket}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.GAME}
              element={
                <PrivateRoute
                  children={<GameView gameSocket={gameSocket} />}
                  setToken={setToken}
                ></PrivateRoute>
              }
            />
            <Route
              path={RoutePath.SETUP2FA}
              element={
                <PrivateRoute
                  children={<Setup2FA />}
                  setToken={setToken}
                ></PrivateRoute>
              }
            />
            <Route
              path={RoutePath.STATS}
              element={
                <PrivateRoute setToken={setToken}>
                  <StatsView />
                </PrivateRoute>
              }
            />
            <Route path={RoutePath.LOGIN_2FA} element={<Login2FAView />} />
            {/* TODO : William Private ? */}
          </Routes>
        </ThemeProvider>
      </Box>
    </>
  );
}
