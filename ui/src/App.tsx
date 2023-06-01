import { ReactElement, useState } from "react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import EditProfileView from "./views/Profile/EditProfileView";
import Setup2FA from "./views/Profile/Setup2FA";
import LoginView from "./views/Login/LoginView";
import Login2FAView from "./views/Login/Login2FAView";
import { RoutePath } from "./interfaces/router.interface";
import { TranscendanceContext } from "./context/transcendance-context";
import { TranscendanceStateActionType } from "./context/transcendance-reducer";
import Toast from "./context/toast";
import { Box, ThemeProvider } from "@mui/material";
import theme from "./MuiTheme";
import classes from "./styles.module.scss";
import { useImageStore } from "./store/users-store";
import { PrivateRoute } from "./components/Protection/PrivateRoute";
import { Cookie, getIsAuthenticated, initAuthToken } from "./utils/auth-helper";
import GameView from "./views/Game/GameView";
import StatsView from "./views/Stats/StatsView";
import ProfileView from "./views/Profile/ProfileView";
import LeftDrawer from "./components/LeftDrawer/LeftDrawer";
import Navbar from "./components/Navbar";
import RightDrawer from "./components/RightDrawer/RightDrawer";
import { BigSocket } from "./classes/BigSocket.class";

export default function App() {
  const [bigSocket] = useState<BigSocket>(new BigSocket());

  const [token, setToken] = useState<boolean>(false);

  const [image, setImage] = useImageStore(
    (state: { image: any; setImage: any }) => [state.image, state.setImage]
  );
  const imageUrl = image ? URL.createObjectURL(image) : "";

  // different method to initialize our sockets that makes them persistent over all views
  React.useEffect(() => {
    if (token) {
      let gotToken = localStorage.getItem(Cookie.TOKEN);
      if (gotToken !== "") {
        gotToken = "Bearer " + gotToken;
        if (bigSocket.socket.connected === false) {
          bigSocket.socket.auth = { token: gotToken };
          bigSocket.socket.connect();
          bigSocket.initializeName(gotToken);
          bigSocket.logIn();
        }
      }
    }
    return () => {
      if (bigSocket.socket.connected) bigSocket.socket.disconnect();
    };
  }, [token, bigSocket]);

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
    console.log("redirect react");
    initAuthToken();
    return <Navigate to={RoutePath.EDITPROFILE} />;
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
          autoClose={transcendanceState.toast?.autoClose}
          onClose={closeToast}
          onAccept={transcendanceState.toast?.onAccept}
          onRefuse={transcendanceState.toast?.onRefuse}
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
          <Navbar bigSocket={bigSocket} setToken={setToken} />
          <LeftDrawer bigSocket={bigSocket} />
          <RightDrawer bigSocket={bigSocket} />
          <Routes>
            <Route path="*" element={<AuthWrapper />} />
            <Route
              path={RoutePath.LOGIN}
              element={<LoginView bigSocket={bigSocket} />}
            />
            <Route
              path={RoutePath.REDIRECT}
              element={
                <PrivateRoute
                  setToken={setToken}
                  children={<RedirectWrapper />}
                ></PrivateRoute>
              }
            />
            <Route
              path={RoutePath.EDITPROFILE}
              element={
                <PrivateRoute setToken={setToken}>
                  <EditProfileView />
                </PrivateRoute>
              }
            />
            <Route
              path={RoutePath.GAME}
              element={
                <PrivateRoute
                  setToken={setToken}
                  children={<GameView bigSocket={bigSocket} />}
                ></PrivateRoute>
              }
            />
            <Route
              path={RoutePath.SETUP2FA}
              element={
                <PrivateRoute
                  setToken={setToken}
                  children={<Setup2FA />}
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
            <Route
              path={RoutePath.PROFILE}
              element={
                <PrivateRoute setToken={setToken}>
                  <ProfileView />
                </PrivateRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </Box>
    </>
  );
}
