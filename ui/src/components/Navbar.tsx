import { Tab, Tabs, AppBar, Theme } from "@mui/material";
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
import { useTheme } from "@mui/material";
import { UserStatus } from "../interfaces/user.interface";
import { UserSocket } from "../classes/UserSocket.class";
import { listenerWrapper } from "../services/initSocket.service";
import { RoutePath } from "../interfaces/router.interface";

export const navbarHeight = "4rem";

interface Props {
  userSocket: UserSocket;
  setToken: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavBar(props: Props): React.ReactElement {
  const { userSocket, setToken } = props;
  const theme = useTheme();
  const state = useLocation().state;
  const navigate = useNavigate();
  const location = useLocation();
  const { classes } = useStyles();
  const [userId, setUserId] = useState<string>("");
  const [image, setImage] = useImageStore((state) => [
    state.image,
    state.setImage,
  ]);
  const [isRightOpen, setIsRightOpen] = useDrawersStore(
    (state: { isRightOpen: any; setIsRightOpen: any }) => [
      state.isRightOpen,
      state.setIsRightOpen,
    ]
  );
  const [status, setStatus] = React.useState<UserStatus>(UserStatus.OFFLINE);
  const [hidden, setHidden] = React.useState<boolean>(false);
  const [isNavbarCacheInvalid, setIsNavbarCacheInvalid] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      location.pathname == RoutePath.LOGIN ||
      location.pathname == RoutePath.LOGIN_2FA
    ) {
      setHidden(true);
    } else {
      setIsNavbarCacheInvalid(true);
      setHidden(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    let token = localStorage.getItem(Cookie.TOKEN);

    if (token) {
      setUserId(getTokenData(token).id.toString());
    }
    if (userId && image === null) {
      wrapperFetchProfilePicture(userId);
      setIsNavbarCacheInvalid(false);
    }
  }, [userId, isNavbarCacheInvalid]);

  const statusUpdateListener = (data: any) => {
    if (data.id === userId) setStatus(data.status);
  };

  React.useEffect(() => {
    listenerWrapper(() => {
      if (userSocket.socket.connected) {
        userSocket.socket.on("statusUpdate", statusUpdateListener);
        userSocket.status(userId);
        return true;
      }
      return false;
    });
    return () => {
      listenerWrapper(() => {
        if (userSocket.socket.connected) {
          userSocket.socket.off("statusUpdate", statusUpdateListener);
          return true;
        }
        return false;
      });
    };
  }, [userSocket, userId]);

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
      {!hidden && (
        <AppBar className={classes.menuBar}>
          <Box
            className={classes.picture}
            sx={{
              right: isRightOpen ? 320 : 70,
              transition: (theme) =>
                theme.transitions.create("right", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              ...(isRightOpen && {
                transition: (theme) =>
                  theme.transitions.create("right", {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
              }),
            }}
          >
            <PictureMenu image={image} status={status} setToken={setToken} />
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
      )}
    </>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  menuBar: {
    height: navbarHeight,
    width: "100%",
    backgroundColor: classes.colorPrimary,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  picture: {
    zIndex: theme.zIndex.appBar + 1,
    position: "absolute",
  },
  tab: {
    color: classes.colorSecondary,
    fontSize: "1rem",
    fontWeight: "bold",
    paddingLeft: "0",
    paddingBottom: "0rem",
  },
}));
