import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { Response } from "../../services/common/resolve";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Divider,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "../../interfaces/user.interface";
import { Cookie, getTokenData } from "../../utils/auth-helper";
import friendshipsService from "../../services/friendships.service";
import ListFriends from "./List/ListFriends";
import ListRequested from "./List/ListRequested";
import ListReceived from "./List/ListReceived";
import { TranscendanceContext } from "../../context/transcendance-context";
import { AxiosError } from "axios";
import { ToastType } from "../../context/toast";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useDrawersStore } from "../../store/drawers-store";
import { navbarHeight } from "../Navbar";

const drawerWidth = 240;
const drawerWidthClosed = "4rem";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: drawerWidthClosed,
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  border: "none",
  backgroundColor: theme.palette.primary.light,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${drawerWidthClosed} + 1px)`,
  height: navbarHeight,
  right: "auto",
  border: "none",
  boxShadow: "none",
  ...(open && {
    marginLeft: drawerWidth,
    zIndex: -1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function MiniDrawer() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [friends, setFriends] = React.useState<User[]>([]);
  const [requests, setRequests] = React.useState<User[]>([]);
  const [requestsReceived, setRequestsReceived] = React.useState<User[]>([]);
  const [userId, setUserId] = React.useState<string>("");
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);
  const [open, setOpen] = React.useState(false);
  const [isCacheInvalid, setIsCacheInvalid] = useDrawersStore(
    (state: { isFriendsCacheUnvalid: any; setisFriendsCacheUnvalid: any }) => [
      state.isFriendsCacheUnvalid,
      state.setisFriendsCacheUnvalid,
    ]
  );

  React.useEffect(() => {
    let token = localStorage.getItem(Cookie.TOKEN);

    if (token) {
      setUserId(getTokenData(token).id.toString());
    }
    if (userId) {
      fetchFriends();
      fetchRequested();
      fetchReceived();
      setIsCacheInvalid(false);
    }
  }, [userId, isCacheInvalid]);

  function showErrorToast(error?: AxiosError) {
    const message = error?.response?.data as any;
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.ERROR,
        title: "Error",
        message: message,
      },
    });
  }

  function showSuccessToast(message: string) {
    dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.SUCCESS,
        title: "Success",
        message: message as unknown as string,
      },
    });
  }

  async function fetchFriends() {
    const usersFriends: Response<User[]> = await friendshipsService.getAccepted(
      userId
    );
    const isSuccess = !usersFriends?.error;
    if (!isSuccess) {
      showErrorToast(usersFriends.error);
    } else {
      setFriends(usersFriends.data);
    }
  }

  async function fetchRequested() {
    const usersRequested: Response<User[]> =
      await friendshipsService.getRequested(userId);
    const isSuccess = !usersRequested?.error;
    if (!isSuccess) {
      showErrorToast(usersRequested.error);
    } else {
      setRequests(usersRequested.data);
    }
  }

  async function fetchReceived() {
    const usersReceived: Response<User[]> =
      await friendshipsService.getReceived(userId);
    const isSuccess = !usersReceived?.error;
    if (!isSuccess) {
      showErrorToast(usersReceived.error);
    } else {
      setRequestsReceived(usersReceived.data);
    }
  }

  const triggerDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Tooltip title="List of friends">
            <Box
              display={"flex"}
              alignContent={"center"}
              justifyContent={"center"}
              width="100%"
              height="100%"
            >
              <IconButton
                onClick={triggerDrawerOpen}
                sx={{
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon
                  sx={{
                    fill: theme.palette.secondary.main,
                    width: "35px",
                    height: "35px",
                  }}
                />
              </IconButton>
            </Box>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.palette.secondary.light,
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={triggerDrawerOpen} color={"secondary"}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider
          variant="middle"
          sx={{
            marginBottom: "2.5rem",
          }}
        />
        <Box
          display={"flex"}
          justifyContent="center"
          width={"calc(64px + 1px)"}
        >
          <Typography
            fontSize="11px"
            color={"#8A8A8A"}
            sx={{ textDecoration: "underline" }}
          >
            {t(translationKeys.friends)}
          </Typography>
        </Box>
        <ListFriends
          userId={userId}
          open={open}
          users={friends}
          triggerDrawerOpen={triggerDrawerOpen}
          showErrorToast={showErrorToast}
        />
        <Divider
          variant="middle"
          sx={{
            marginTop: "2.5rem",
            marginBottom: "2.5rem",
          }}
        ></Divider>
        <Box
          display={"flex"}
          justifyContent="center"
          width={"calc(64px + 1px)"}
        >
          <Typography
            fontSize="11px"
            color={"#8A8A8A"}
            sx={{ textDecoration: "underline" }}
          >
            {t(translationKeys.requested)}
          </Typography>
        </Box>
        <ListRequested
          userId={userId}
          open={open}
          users={requests}
          triggerDrawerOpen={triggerDrawerOpen}
          showErrorToast={showErrorToast}
          showSuccessToast={showSuccessToast}
        />
        <Divider
          variant="middle"
          sx={{
            marginTop: "2.5rem",
            marginBottom: "2.5rem",
          }}
        ></Divider>
        <Box
          display={"flex"}
          justifyContent="center"
          width={"calc(64px + 1px)"}
        >
          <Typography
            fontSize="11px"
            color={"#8A8A8A"}
            sx={{ textDecoration: "underline" }}
          >
            {t(translationKeys.received)}
          </Typography>
        </Box>
        <ListReceived
          userId={userId}
          open={open}
          users={requestsReceived}
          triggerDrawerOpen={triggerDrawerOpen}
          showErrorToast={showErrorToast}
        />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
    </Box>
  );
}
