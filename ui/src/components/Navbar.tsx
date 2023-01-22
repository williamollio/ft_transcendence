import { Tab, Tabs, AppBar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { idTabs } from "../interfaces/tab.interface";
import { tabs, NavTab, TabWithId } from "../interfaces/tab.interface";
import { makeStyles } from "tss-react/mui";
import { useLocation } from "react-router-dom";
import classes from "../styles.module.scss";
import { useImageStore } from "../store/users-store";
import Avatar from "@material-ui/core/Avatar";
import Box from "@mui/material/Box";

export default function NavBar(): React.ReactElement {
  const state = useLocation().state;
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);

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
    <>
      <AppBar className={classes.menuBar}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={selectedTabId}
            indicatorColor="secondary"
            textColor="secondary"
            sx={{ width: "96%", marginLeft: "65px" }} // should be equal as the width of container-picture
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
          <Box
            id="container-picture"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "4%",
            }}
          >
            <Avatar
              style={{
                width: "55px",
                height: "55px",
              }}
              src={image ? URL.createObjectURL(image) : ""}
            />
          </Box>
        </Box>
      </AppBar>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  menuBar: {
    height: "4rem",
    width: "100%",
    backgroundColor: classes.colorPrimary,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  tab: {
    color: classes.colorSecondary,
    fontSize: "1rem",
    fontFamily: "Soin",
    fontWeight: "bold",
    paddingLeft: "0",
    paddingBottom: "0rem",
  },
}));
