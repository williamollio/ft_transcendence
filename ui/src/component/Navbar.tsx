import { Tab, Tabs, AppBar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { idTabs } from "../interfaces/tab.interface";
import { tabs, NavTab, TabWithId } from "../interfaces/tab.interface";
import { makeStyles } from "tss-react/mui";
import { useLocation } from "react-router-dom";

export default function NavBar(): React.ReactElement {
  const state = useLocation().state;
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [selectedTabId, setSelectedTabId] = useState<number>(
    state?.activeTabId ?? idTabs.PROFILE
  );

  const tabsWithId: TabWithId[] = tabs.map((tab, index) => {
    return {
      id: index,
      label: tab.label,
      link: tab.link,
    };
  });

  function getTabById(id: number): NavTab {
    return tabsWithId.filter((tab) => {
      if (tab.id === id) {
        return tab;
      } else {
		return null;
	  }
    })[0];
  }

  function navigateToSelectedTab(id: number) {
    setSelectedTabId(id);
    navigate(getTabById(id).link, {
      state: { activeTabId: id },
    });
  }

  return (
    <AppBar>
      <Tabs
        value={selectedTabId}
        className={classes.menuBar}
        centered={true}
        TabIndicatorProps={{
          style: { marginBottom: "5px", marginLeft: "-8px" },
        }}
      >
        {tabsWithId.map((tab) => {
          return (
            <Tab
              key={`navbar-${tab.id}`}
              label={tab.label}
              value={tab.id}
              classes={{
                root: classes.tab,
              }}
              onClick={() => {
                navigateToSelectedTab(tab.id);
              }}
              className={classes.tab}
            />
          );
        })}
      </Tabs>
    </AppBar>
  );
}

const useStyles = makeStyles()(() => ({
  menuBar: {
    height: "4rem",
    width: "100%",
    backgroundColor: "#1d3c45",
  },
  tab: {
    color: "#fff1e1",
    fontSize: "1rem",
    fontFamily: "Soin",
    fontWeight: "bold",
    paddingLeft: "0",
    paddingBottom: "0rem",
  },
}));
