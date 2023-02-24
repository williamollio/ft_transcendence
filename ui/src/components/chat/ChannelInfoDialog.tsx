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
import { SyntheticEvent, useState } from "react";
import { user } from "../../interfaces/chat.interfaces";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelInfoContext from "./ChannelInfoContext";
import GetPasswordDialog from "./GetPasswordDialog";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import GetNameDialog from "./GetNameDialog";

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
  channel: chatRoom | null;
  channelSocket: ChannelSocket;
}) {
  const [selected, setSelected] = useState<user | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    user: user;
  } | null>(null);

  const [openPassword, toggleOpenPassword] = useState<boolean>(false);

  const [openName, toggleOpenName] = useState<boolean>(false);

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

  const handlePasswordChange = (e?: SyntheticEvent) => {
    e ? e.preventDefault() : false;
    toggleOpenPassword(true);
  };

  const handleNameChange = (e?: SyntheticEvent) => {
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
            Channel ID: {channel && channel.id !== "" ? channel.id : "missing"}
          </DialogContent>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <DialogActions>
                <Button variant="outlined" onMouseUp={(e) => handlePasswordChange()} onMouseDown={handlePasswordChange}>
                  Change Password
                </Button>
              </DialogActions>
            </Grid>
            <Grid item>
              <DialogActions>
                <Button variant="outlined" onMouseUp={(e) => handleNameChange()} onMouseDown={handleNameChange}>
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
