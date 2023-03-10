import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { Response } from "../services/common/resolve";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, Divider, Typography } from "@mui/material";
import { UserIds } from "../interfaces/user.interface";
import { Cookie, getTokenData } from "../utils/auth-helper";
import friendshipsService from "../services/friendships.service";
import { fetchProfilePicture } from "../utils/picture-helper";

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
  const [friends, setFriends] = React.useState<UserIds[]>([]);
  const [requests, setRequests] = React.useState<UserIds[]>([]);
  const [userId, setUserId] = React.useState<string>("");
  const [profilePictures, setProfilePictures] = React.useState<{
    [key: string]: string;
  }>({});

  React.useEffect(() => {
    let token = localStorage.getItem(Cookie.TOKEN);

    if (token) {
      setUserId(getTokenData(token).id.toString());
    }
    if (userId) {
      fetchFriends();
      fetchRequests();
    }
  }, [userId]);

  React.useEffect(() => {
    async function loadProfilePictures() {
      const pictures: { [key: string]: string } = {};
      for (const friend of friends) {
        if (friend.filename) {
          const picture = await getProfilePicture(friend.id);
          pictures[friend.id] = picture;
        } else {
          pictures[friend.id] = "";
        }
      }
      for (const request of requests) {
        if (request.filename) {
          const picture = await getProfilePicture(request.id);
          pictures[request.id] = picture;
        } else {
          pictures[request.id] = "";
        }
      }
      setProfilePictures(pictures);
    }

    loadProfilePictures();
  }, [friends, requests]);

  async function fetchFriends() {
    const usersFriends: Response<UserIds[]> =
      await friendshipsService.getAccepted(userId);
    setFriends(usersFriends.data);
  }

  async function fetchRequests() {
    const usersRequests: Response<UserIds[]> =
      await friendshipsService.getRequests(userId);
    setRequests(usersRequests.data);
  }

  async function getProfilePicture(friendId: string): Promise<string> {
    const image = await fetchProfilePicture(friendId);
    return URL.createObjectURL(image);
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
        <List>
          {friends.map((friend: UserIds, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={triggerDrawerOpen}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Avatar key={friend.id} src={profilePictures[friend.id]} />
                </ListItemIcon>
                <ListItemText
                  primary={friend.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider
          variant="middle"
          sx={{
            marginTop: "2.5rem",
            marginBottom: "2.5rem",
          }}
        ></Divider>
        {/* TODO : william responsiveness */}
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
            Requests
          </Typography>
        </Box>
        <List>
          {requests.map((request: UserIds, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={triggerDrawerOpen}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Avatar key={request.id} src={profilePictures[request.id]} />
                </ListItemIcon>
                <ListItemText
                  primary={request.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
    </Box>
  );
}
