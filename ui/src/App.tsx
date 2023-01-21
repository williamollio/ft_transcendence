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
    typography: {
      fontFamily: "Arial",
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            fontWeight: "500",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            fontWeight: "400",
            borderRadius: "2px",
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: "11px",
            fontWeight: "500",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: "white",
            "&.Mui-focused": {
              color: classes.colorPrimary,
            },
            fontSize: "14px",
            fontWeight: "400",
            height: "56px",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            height: "56px",
            backgroundColor: "white",
          },
          listbox: {
            "& .MuiAutocomplete-option": {
              fontSize: "14px",
              fontWeight: "400",
            },
          },
        },
      },
    },
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
