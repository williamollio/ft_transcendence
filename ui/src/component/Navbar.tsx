import React from "react";
import { makeStyles } from "tss-react/mui";
import { RoutePath } from "../component/App";

interface Tabs {
  label: string;
  link: RoutePath;
}

export default function Navbar(): React.ReactElement {
  const { classes } = useStyles();
  const [tab, setTab] = React.useState<Tabs[]>([]);

  return (
    <div className={classes.menuBar}>
      <p>Navbar</p>
    </div>
  );
}

const useStyles = makeStyles()(() => ({
  menuBar: {
    height: "4rem",
    width: "100%",
    backgroundColor: "#1d3c45",
  },
}));
