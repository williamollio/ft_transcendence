import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ChatIcon from "@mui/icons-material/Chat";
import Chat from "../chat/Chat";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { UserSocket } from "../../classes/UserSocket.class";
import { navbarHeight } from "../Navbar";

const drawerWidth = 300;
const drawerWidthClosed = "4rem";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${drawerWidthClosed} + 1px)`,
  height: navbarHeight,
  border: "none",
  boxShadow: "none",
  ...(open && {
    width: `${drawerWidth}px`,
    marginRight: "0rem",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

interface Props {
  channelSocket: ChannelSocket;
  userSocket: UserSocket;
}

export default function RightDrawer(props: Props) {
  const { channelSocket, userSocket } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Box
          display={"flex"}
          alignContent={"center"}
          justifyContent={"center"}
          width="100%"
          height="100%"
        >
          <IconButton
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: "none" }) }}
          >
            <ChatIcon
              sx={{
                fill: theme.palette.secondary.main,
                width: "35px",
                height: "35px",
              }}
            />
          </IconButton>
        </Box>
      </AppBar>
      <Drawer
        variant="persistent"
        open={open}
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: theme.palette.secondary.light,
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} color="secondary">
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider
          variant="middle"
          sx={{
            marginBottom: "2.5rem",
          }}
        />
        <Chat channelSocket={channelSocket} userSocket={userSocket} />
      </Drawer>
    </Box>
  );
}
