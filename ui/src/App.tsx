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
import { getIsAuthenticated, initAuthToken } from "./utils/auth-helper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserSocket } from "./classes/UserSocket.class";
import GameView from "./views/Game/GameView";
import StatsView from "./views/Stats/StatsView";

export default function App() {
  const [userSocket] = useState<UserSocket>(new UserSocket());
  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);
  const imageUrl = image ? URL.createObjectURL(image) : "";

  const queryClient = new QueryClient();

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
              path={RoutePath.CHAT}
              element={
                <PrivateRoute>
                  <QueryClientProvider client={queryClient}>
                    <ChatView userSocket={userSocket} />
                  </QueryClientProvider>
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
            <Route
              path={RoutePath.GAME}
              element={
                <PrivateRoute>
                  <GameView />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.STATS}
              element={
                <QueryClientProvider client={queryClient}>
                    <StatsView userSocket={userSocket}/>
                  </QueryClientProvider>
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
