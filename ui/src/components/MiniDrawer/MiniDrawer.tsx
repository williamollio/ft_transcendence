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
import ListSent from "./List/ListSent";
import ListReceived from "./List/ListReceived";

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

  React.useEffect(() => {
    let token = localStorage.getItem(Cookie.TOKEN);

    if (token) {
      setUserId(getTokenData(token).id.toString());
    }
    if (userId) {
      fetchFriends();
      fetchRequests();
      fetchRequestsReceived();
    }
  }, [userId]);

  async function fetchFriends() {
    const usersFriends: Response<User[]> = await friendshipsService.getAccepted(
      userId
    );
    setFriends(usersFriends.data);
  }

  async function fetchRequests() {
    const usersRequests: Response<User[]> =
      await friendshipsService.getRequests(userId);
    setRequests(usersRequests.data);
  }

  async function fetchRequestsReceived() {
    const usersRequestsReceived: Response<User[]> =
      await friendshipsService.getRequestsReceived(userId);
    setRequestsReceived(usersRequestsReceived.data);
  }

  const triggerDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open}>
        {/* TODO : william responsiveness */}
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
        <ListSent
          userId={userId}
          open={open}
          users={requests}
          triggerDrawerOpen={triggerDrawerOpen}
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
        />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
    </Box>
  );
}
