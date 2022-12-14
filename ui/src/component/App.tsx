import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "../views/ProfileView";
import LoginView from "../views/LoginView";
import GameView from "../views/GameView";
import { makeStyles } from "tss-react/mui";
import { RoutePath } from "../interfaces/router.interface";
import { TranscendanceContext } from "../context/transcendance-context";
import { TranscendanceStateActionType } from "../context/transcendance-reducer";
import Toast from "../context/toast";

// TO DO : set up theme for these colors #1d3c45, #d2601a, #fff1e1

export default function App() {
  const { classes } = useStyles();

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
      <div className={classes.root}>
        <Routes>
          <Route path={RoutePath.LOGIN} element={<LoginView />} />
          <Route path={RoutePath.PROFILE} element={<ProfileView />} />
          <Route path={RoutePath.GAME} element={<GameView />} />
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
