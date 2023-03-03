import { createTheme } from "@mui/material";
import classes from "./styles.module.scss";

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
          height: "auto",
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          fontSize: "14px",
          fontFamily: "Helvetica",
          fontWeight: "500",
          minHeight: "40%",
          paddingLeft: "3rem",
          paddingRight: "3rem",
        },
      },
    },
  },
});

export default theme;
