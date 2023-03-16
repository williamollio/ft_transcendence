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
      light: classes.colorSecondaryLight,
    },
  },
  typography: {
    fontFamily: "Arial",
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          borderLeft: "1px solid rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "15px",
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
          height: "53px",
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
          marginTop: "0.5rem",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-indicator": {
            backgroundColor: classes.colorAccent,
          },
          "& .MuiTab-root.Mui-selected": {
            color: classes.colorAccent,
          },
        },
      },
    },
  },
});

export default theme;
