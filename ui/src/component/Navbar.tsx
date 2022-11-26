import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { RoutePath } from "../interfaces/router.interface";
import {
  NavTab,
  LocationStateTab,
  idTabs,
  TabWithId,
} from "../interfaces/tab.interface";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const tabs: NavTab[] = [
  {
    label: "Profile",
    path: RoutePath.PROFILE,
  },
  {
    label: "Game",
    path: RoutePath.GAME,
  },
];

interface LinkTabProps {
  label?: string;
  href?: RoutePath;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export default function Navbar(): React.ReactElement {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const state = useLocation().state as LocationStateTab;
  const [value, setValue] = React.useState<number>(
    state?.idActiveTab ?? idTabs.PROFILE
  );

  const getTabWithId: TabWithId[] = tabs.map((value, index) => {
    return { id: index, label: value.label, path: value.path };
  });

  function getTabById(id: number): NavTab {
    const array = getTabWithId.filter((tab) => {
      if (tab.id === id) {
        return tab;
      }
    });
    return array[0];
  }

  const navigateToSelectedTab = (id: number) => {
    navigate(getTabById(id).path);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("newValue " + newValue);
    setValue(newValue);
    navigateToSelectedTab(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        className={classes.menuBar}
        aria-label="nav-tabs"
      >
        {getTabWithId.map((tab) => {
          return <LinkTab key={tab.id} label={tab.label} href={tab.path} />;
        })}
      </Tabs>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  menuBar: {
    height: "4rem",
    width: "100%",
    backgroundColor: "#1d3c45",
    display: "flex",
    justifyContent: "center",
  },
  tab: {
    color: "gray",
    fontSize: "1.5rem",
    fontFamily: "Soin",
    fontWeight: "bold",
    paddingLeft: "0",
    paddingBottom: "0rem",
  },
}));
