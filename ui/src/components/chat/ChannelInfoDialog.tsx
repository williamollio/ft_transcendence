import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { channelUser, user } from "../../interfaces/chat.interfaces";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelInfoContext from "./ChannelInfoContext";
import GetPasswordDialog from "./GetPasswordDialog";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import GetNameDialog from "./GetNameDialog";
import { useQuery } from "@tanstack/react-query";
import { UserSocket } from "../../classes/UserSocket.class";
import ChannelService from "../../services/channel.service";

export default function ChannelInfoDialog({
  blockedUser,
  refetchBlockedUsers,
  userSocket,
  setAlertMsg,
  channelInfoOpen,
  toggleChannelInfo,
  channel,
  channelSocket,
}: {
  blockedUser: Array<string>;
  refetchBlockedUsers: any;
  userSocket: UserSocket;
  toggleError: any;
  setAlertMsg: any;
  setNewChannel: any;
  channelInfoOpen: boolean;
  toggleChannelInfo: any;
  channel: chatRoom | undefined;
  channelSocket: ChannelSocket;
}) {
  const [selected, setSelected] = useState<user | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    user: channelUser;
  } | null>(null);

  const [userList, setUserList] = useState<Array<channelUser>>([]);

  const [openPassword, toggleOpenPassword] = useState<boolean>(false);

  const [openName, toggleOpenName] = useState<boolean>(false);

  const { data, isError, isLoading, refetch } = useQuery(
    ["channelUsers", channel?.id],
    () => ChannelService.fetchUsersOfChannel(channel?.id!),
    { enabled: typeof channel?.id !== "undefined" && channelInfoOpen === true }
  );

  useEffect(() => {
    if (!isLoading && !isError && data) {
      if (channel) {
        const newList = new Array<channelUser>();
        data.forEach((element: channelUser) => {
          newList.push({
            id: element.id,
            name: element.name,
            status: element.status,
            role: element.role,
          });
        });
        setUserList(newList);
      }
    }
  }, [data, isLoading, isError]);

  const userJoinedListener = (userId: string, channelId: string) => {
    if (userId !== channelSocket.user.id) refetch();
  };

  const userLeftListener = (userId: string, channelId: string) => {
    if (userId !== channelSocket.user.id) refetch();
  };

  useEffect(() => {
    ["userConnected, userDisconnected"].forEach((element) => {
      userSocket.socket.on(element, () => {
        refetch();
      });
    });
    if (channelSocket.socket.connected) {
      channelSocket.registerListener("roomJoined", userJoinedListener);
      channelSocket.registerListener("roomLeft", userLeftListener);
      channelSocket.registerListener("roleUpdated", () => {
        refetch();
      });
    }
    return () => {
      if (channelSocket.socket.connected) {
        channelSocket.removeListener("roomJoined", userJoinedListener);
        channelSocket.removeListener("roomLeft", userLeftListener);
        channelSocket.removeListener("roleUpdated");
	}
        userSocket.socket.off("userConnected");
        userSocket.socket.off("userDisconnected");
    };
  }, [channelSocket.socket, channelSocket.socket.connected]);

  const handleClose = () => {
    toggleChannelInfo(false);
  };

  const handleSelect = (e: any, data: any) => {
    setSelected(data);
  };

  const handleContextMenu = (event: any, User: channelUser) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            user: User,
          }
        : null
    );
  };

  const listUsers = userList.map((user) => {
    return (
      <TableRow
        key={user.id}
        hover
        onClick={(e) => handleSelect(e, user)}
        selected={user.id === (selected ? selected.id : false)}
        onContextMenu={(e) => handleContextMenu(e, user)}
      >
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.status}</TableCell>
        <TableCell>{user.role === "USER" ? "" : user.role}</TableCell>
      </TableRow>
    );
  });

  const handlePasswordChange = (e?: SyntheticEvent) => {
    setAlertMsg("Failed to change password");
    e ? e.preventDefault() : false;
    toggleOpenPassword(true);
  };

  const handleNameChange = (e?: SyntheticEvent) => {
    setAlertMsg("Failed to change channel name");
    e ? e.preventDefault() : false;
    toggleOpenName(true);
  };

  const closeNameDialog = () => {
    toggleOpenName(false);
  };

  const closePasswordDialog = () => {
    toggleOpenPassword(false);
  };

  return (
    <Dialog
      open={channelInfoOpen}
      onClose={handleClose}
      PaperProps={{ sx: { bgcolor: "grey.500" } }}
    >
      <Grid container direction="column">
        <Grid item>
          <DialogTitle>Channel Info</DialogTitle>
        </Grid>
        <Divider></Divider>
        <Grid item>
          <DialogContent>
            Channel ID: {channel?.id !== "" ? channel?.id : "missing"}
          </DialogContent>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <DialogActions>
                <Button
                  variant="outlined"
                  onMouseUp={(e) => handlePasswordChange()}
                  onMouseDown={handlePasswordChange}
                >
                  Change Password
                </Button>
              </DialogActions>
            </Grid>
            <Grid item>
              <DialogActions>
                <Button
                  variant="outlined"
                  onMouseUp={(e) => handleNameChange()}
                  onMouseDown={handleNameChange}
                >
                  Change Name
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </Grid>
        <Grid item alignItems={"center"} justifyContent={"center"}>
          <Box
            sx={{ height: "275px", width: "99%" }}
            alignItems="center"
            justifyContent="center"
            display="flex"
          >
            <TableContainer
              component={Paper}
              sx={{ height: "270px", width: "99%", bgcolor: "grey.600" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{listUsers}</TableBody>
              </Table>
            </TableContainer>
            <ChannelInfoContext
              blockedUser={blockedUser}
              refetchBlockedUsers={refetchBlockedUsers}
              setAlertMsg={setAlertMsg}
              channel={channel}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              channelSocket={channelSocket}
            ></ChannelInfoContext>
          </Box>
        </Grid>
      </Grid>
      <GetNameDialog
        open={openName}
        toggleOpen={closeNameDialog}
        channel={channel}
        channelSocket={channelSocket}
      ></GetNameDialog>
      <GetPasswordDialog
        open={openPassword}
        toggleOpen={closePasswordDialog}
        channel={channel}
        channelSocket={channelSocket}
      ></GetPasswordDialog>
    </Dialog>
  );
}
