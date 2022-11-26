import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProfileView from "../views/ProfileView";
import LoginView from "../views/LoginView";
import { makeStyles } from "tss-react/mui";

export enum RoutePath {
  PROFILE = "/profile",
  LOGIN = "/",
}

function App() {
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.root}>
        <Routes>
          <Route path={RoutePath.LOGIN} element={<LoginView />} />
          <Route path={RoutePath.PROFILE} element={<ProfileView />} />
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

export default App;
