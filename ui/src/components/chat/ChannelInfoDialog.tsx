import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { user } from "../../interfaces/chat.interfaces";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelInfoContext from "./ChannelInfoContext";
import GetPasswordDialog from "./GetPasswordDialog";
import { ChannelSocket } from "../../classes/ChannelSocket.class";

export default function ChannelInfoDialog({
  contextMenuClose,
  channelInfoOpen,
  toggleChannelInfo,
  channel,
  channelSocket,
}: {
  contextMenuClose: any;
  channelInfoOpen: boolean;
  toggleChannelInfo: any;
  channel: chatRoom;
  channelSocket: ChannelSocket;
}) {
  const [selected, setSelected] = useState<user | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    user: user;
  } | null>(null);

  const [openPassword, toggleOpenPassword] = useState<boolean>(false);

  const handleClose = () => {
    toggleChannelInfo(false);
    contextMenuClose();
  };

  const handleSelect = (e: any, data: any) => {
    setSelected(data);
  };

  const handleContextMenu = (event: any, User: user) => {
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
              <TableCell>status</TableCell>
              <TableCell>{user.rank}</TableCell>
            </TableRow>
          );
        })
      : false;

  const handlePasswordChange = () => {
	toggleOpenPassword(true);
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
        <Grid item>
          <DialogContent>
            Channel ID: {channel && channel.id !== "" ? channel.id : "missing"}
          </DialogContent>
        </Grid>
        <Grid item alignItems={"center"} justifyContent={"center"}>
          <DialogActions>
            <Button variant="outlined" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </DialogActions>
        </Grid>
        <Grid item>
          <Box
            sx={{ height: "275px", width: "260px" }}
            alignItems="center"
            justifyContent="center"
            display="flex"
          >
            <TableContainer
              component={Paper}
              sx={{ height: "270px", width: "255px", bgcolor: "grey.600" }}
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
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
			  channelSocket={channelSocket}
            ></ChannelInfoContext>
          </Box>
        </Grid>
      </Grid>
      <GetPasswordDialog
        open={openPassword}
        toggleOpen={toggleOpenPassword}
        channel={channel}
      ></GetPasswordDialog>
    </Dialog>
  );
}
