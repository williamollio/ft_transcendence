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
import { fetchUsersOfChannel } from "./hooks/channelUsers.fetch";

export default function ChannelInfoDialog({
  toggleError,
  setAlertMsg,
  setNewChannel,
  channelInfoOpen,
  toggleChannelInfo,
  channel,
  channelSocket,
}: {
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

  const [openPassword, toggleOpenPassword] = useState<boolean>(false);

  const [openName, toggleOpenName] = useState<boolean>(false);

  const { data, error, isError, isLoading, refetch } = useQuery(
    ["channelUsers", channel?.id],
    () => fetchUsersOfChannel(channel?.id!),
    { enabled: typeof channel?.id !== "undefined" }
  );

  if (!isLoading) {
    data.forEach((element: channelUser) => {
      if (channel) {
        channel.users = new Array<channelUser>();
        channel.users.push({
          id: element.id,
          name: "test",
          status: element.status,
          rank: "",
        });
      }
    });
  }

  const userJoinedListener = (userId: string, channelId: string) => {
    if (userId !== channelSocket.user.id) refetch();
  };

  useEffect(() => {
    channelSocket.socket.on("roomJoined", userJoinedListener);
    channelSocket.socket.on("roomLeft", (userId: string, channelId: string) => {
      if (userId !== channelSocket.user.id) refetch();
    });
    channelSocket.socket.on("roleUpdated", () => {
      refetch();
    });
    return () => {
      channelSocket.socket.off("roomJoined");
      channelSocket.socket.off("roomLeft");
      channelSocket.socket.off("roleUpdated");
    };
  }, [channelSocket.socket]);

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

  const listUsers =
    channel && channel.users
      ? channel.users.map((user) => {
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
              <TableCell>{user.rank}</TableCell>
            </TableRow>
          );
        })
      : false;

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
              setAlertMsg={setAlertMsg}
              toggleError={toggleError}
              channel={channel}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              channelSocket={channelSocket}
            ></ChannelInfoContext>
          </Box>
        </Grid>
      </Grid>
      <GetNameDialog
        toggleError={toggleError}
        open={openName}
        toggleOpen={closeNameDialog}
        channel={channel}
        channelSocket={channelSocket}
      ></GetNameDialog>
      <GetPasswordDialog
        toggleError={toggleError}
        open={openPassword}
        toggleOpen={closePasswordDialog}
        channel={channel}
        channelSocket={channelSocket}
      ></GetPasswordDialog>
    </Dialog>
  );
}
