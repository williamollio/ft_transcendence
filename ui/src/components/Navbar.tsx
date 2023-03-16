import { Tab, Tabs, AppBar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { idTabs } from "../interfaces/tab.interface";
import { tabs, NavTab, TabWithId } from "../interfaces/tab.interface";
import { makeStyles } from "tss-react/mui";
import { useLocation } from "react-router-dom";
import classes from "../styles.module.scss";
import { useImageStore } from "../store/users-store";
import Box from "@mui/material/Box";
import PictureMenu from "./PictureMenu";
import { Cookie, getTokenData } from "../utils/auth-helper";
import { fetchProfilePicture } from "../utils/picture-helper";
import { useDrawersStore } from "../store/drawers-store";
import { useTheme } from "@emotion/react";

export default function NavBar(): React.ReactElement {
  const theme = useTheme();
  const state = useLocation().state;
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [userId, setUserId] = useState<string>("");
  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);
  const [isOpen, setIsOpen] = useDrawersStore(
    (state: { isLeftOpen: any; setIsLeftOpen: any }) => [
      state.isLeftOpen,
      state.setIsLeftOpen,
    ]
  );

  React.useEffect(() => {
    let token = localStorage.getItem(Cookie.TOKEN);

    if (token) {
      setUserId(getTokenData(token).id.toString());
    }
    if (userId && image === null) {
      wrapperFetchProfilePicture(userId);
    }
  }, [userId]);

  async function wrapperFetchProfilePicture(userId: string) {
    const pictureFetched = await fetchProfilePicture(userId);
    setImage(pictureFetched);
  }

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
          className={classes.picture}
          zIndex={"1"}
          sx={{
            left: isOpen ? 230 : 55,
            transition: (theme) =>
              theme.transitions.create("left", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <PictureMenu image={image} />
        </Box>
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
            sx={{ width: "90%" }}
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
  picture: {
    position: "absolute",
    top: 0,
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
