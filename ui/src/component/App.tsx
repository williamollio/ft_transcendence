import "./App.css";
import Login2FAView from "../views/Login2FAView";
import { ReactElement, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileView from "../views/Profile/ProfileView";
import LoginView from "../views/Login/LoginView";
import GameView from "../views/Game/GameView";
import { RoutePath } from "../interfaces/router.interface";
import { TranscendanceContext } from "../context/transcendance-context";
import { TranscendanceStateActionType } from "../context/transcendance-reducer";
import Toast from "../context/toast";
import { Box } from "@mui/material";

// TO DO : set up theme for these colors #1d3c45, #d2601a, #fff1e1

export default function App() {
  const isAuthenticated = true;

  const AuthWrapper = ({
    isAuthenticated,
  }: {
    isAuthenticated: boolean;
  }): ReactElement => {
    return isAuthenticated ? (
      <Navigate to="/profile" replace />
    ) : (
      <Navigate to="/login2fa" replace />
    );
  };
  function closeToast() {
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: undefined,
    });
  }

  const { transcendanceState, dispatchTranscendanceState } =
    useContext(TranscendanceContext);

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
      </Box>
    </>
  );
}
