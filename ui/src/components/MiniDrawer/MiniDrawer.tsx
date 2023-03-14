import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { Response } from "../../services/common/resolve";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Divider, Typography } from "@mui/material";
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

const drawerWidth = 240;

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
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
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [friends, setFriends] = React.useState<User[]>([]);
  const [requests, setRequests] = React.useState<User[]>([]);
  const [requestsReceived, setRequestsReceived] = React.useState<User[]>([]);
  const [userId, setUserId] = React.useState<string>("");
  const { dispatchTranscendanceState } = React.useContext(TranscendanceContext);

  React.useEffect(() => {
    let token = localStorage.getItem(Cookie.TOKEN);

    if (token) {
      setUserId(getTokenData(token).id.toString());
    }
    if (userId) {
      fetchFriends();
      fetchRequested();
      fetchReceived();
    }
  }, [userId]);

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
      <Drawer variant="permanent" open={open}>
        <Box
          display={"flex"}
          justifyContent="center"
          width={"calc(64px + 1px)"}
          mt="2.5rem"
        >
          <Typography
            fontSize="12px"
            color={"#8A8A8A"}
            sx={{ textDecoration: "underline" }}
          >
            Friends
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
            fontSize="12px"
            color={"#8A8A8A"}
            sx={{ textDecoration: "underline" }}
          >
            Sent
          </Typography>
        </Box>
        <ListRequested
          userId={userId}
          open={open}
          users={requests}
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
            fontSize="12px"
            color={"#8A8A8A"}
            sx={{ textDecoration: "underline" }}
          >
            Received
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
