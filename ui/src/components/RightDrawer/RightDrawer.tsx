import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChatIcon from "@mui/icons-material/Chat";
import Chat from "../chat/Chat";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { UserSocket } from "../../classes/UserSocket.class";
import { navbarHeight } from "../Navbar";
import { GameSocket } from "../../classes/GameSocket.class";
import { useDrawersStore } from "../../store/drawers-store";
import { Tooltip } from "@mui/material";
import { RoutePath } from "../../interfaces/router.interface";
import { useLocation } from "react-router-dom";

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
  gameSocket: GameSocket;
}

export default function RightDrawer(props: Props) {
  const { channelSocket, userSocket, gameSocket } = props;
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useDrawersStore(
    (state: { isRightOpen: any; setIsRightOpen: any }) => [
      state.isRightOpen,
      state.setIsRightOpen,
    ]
  );

  const [hidden, setHidden] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      location.pathname == RoutePath.LOGIN ||
      location.pathname == RoutePath.LOGIN_2FA
    ) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [location.pathname]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!hidden && (
        <Box
          sx={{ display: "flex", zIndex: (theme) => theme.zIndex.modal + 2 }}
        >
          <AppBar position="fixed" open={open}>
            <Box
              display={"flex"}
              alignContent={"center"}
              justifyContent={"center"}
              width="100%"
              height="100%"
            >
              <Tooltip title="Chat">
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
              </Tooltip>
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
            <Chat
              channelSocket={channelSocket}
              userSocket={userSocket}
              gameSocket={gameSocket}
            />
          </Drawer>
        </Box>
      )}
    </>
  );
}
