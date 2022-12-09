import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileView from "../views/ProfileView";
import LoginView from "../views/LoginView";
import GameView from "../views/GameView";
import { makeStyles } from "tss-react/mui";
import { RoutePath } from "../interfaces/router.interface";
import Login2FAView from "../views/Login2FAView";
import { ReactElement } from "react";

// TO DO : set up theme for these colors #1d3c45, #d2601a, #fff1e1

export default function App() {
  const { classes } = useStyles();
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

  return (
    <>
      <div className={classes.root}>
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
      </div>
    </>
  );
}

// https://github.com/garronej/tss-react

const useStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#fff1e1",
  },
}));
