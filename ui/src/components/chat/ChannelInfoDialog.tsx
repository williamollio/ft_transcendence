import {
  Box,
  Button,
  Dialog,
  DialogActions,
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
import React, { SyntheticEvent, useEffect, useState } from "react";
import { channelUser, user } from "../../interfaces/chat.interface";
import { chatRoom } from "../../classes/chatRoom.class";
import GetPasswordDialog from "./GetPasswordDialog";
import { BigSocket } from "../../classes/BigSocket.class";
import GetNameDialog from "./GetNameDialog";
import { useQuery } from "@tanstack/react-query";
import ChannelService from "../../services/channel.service";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import { listenerWrapper } from "../../services/initSocket.service";

interface Props {
  channelInfoOpen: boolean;
  toggleChannelInfo: React.Dispatch<React.SetStateAction<boolean>>;
  channel: chatRoom | undefined;
  bigSocket: BigSocket;
}

export default function ChannelInfoDialog(props: Props) {
  const { channelInfoOpen, toggleChannelInfo, channel, bigSocket } = props;
  const { t } = useTranslation();

  const [selected, setSelected] = useState<user | null>(null);
  const [userList, setUserList] = useState<Array<channelUser>>([]);
  const [openPassword, toggleOpenPassword] = useState<boolean>(false);
  const [openName, toggleOpenName] = useState<boolean>(false);

  const { data, isError, isLoading, refetch } = useQuery(
    ["channelUsers", channel?.id],
    () => ChannelService.fetchUsersOfChannel(channel?.id!),
    {
      enabled: typeof channel?.id !== "undefined" && channelInfoOpen === true,
      refetchInterval: 5000,
    }
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

  const userJoinedListener = (userId: string, _channelId: string) => {
    if (userId !== bigSocket.user.id) refetch();
  };

  const userLeftListener = (userId: string, _channelId: string) => {
    if (userId !== bigSocket.user.id) refetch();
  };

  useEffect(() => {
    listenerWrapper(() => {
      if (bigSocket.socket.connected) {
        bigSocket.socket.on("roomJoined", userJoinedListener);
        bigSocket.socket.on("roomLeft", userLeftListener);
        bigSocket.socket.on("roleUpdated", () => {
          refetch();
        });
        return true;
      }
      return false;
    });
    return () => {
      listenerWrapper(() => {
        if (bigSocket.socket.connected) {
          bigSocket.socket.off("roomJoined", userJoinedListener);
          bigSocket.socket.off("roomLeft", userLeftListener);
          bigSocket.socket.off("roleUpdated");
          return true;
        }
        return false;
      });
    };
  }, [bigSocket.socket, bigSocket.socket.connected]);

  const handleClose = () => {
    toggleChannelInfo(false);
  };

  const handleSelect = (e: any, data: any) => {
    setSelected(data);
  };

  const listUsers = userList.map((user) => {
    return (
      <TableRow
        key={user.id}
        hover
        onClick={(e) => handleSelect(e, user)}
        selected={user.id === (selected ? selected.id : false)}
      >
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.status}</TableCell>
        <TableCell>{user.role === "USER" ? "" : user.role}</TableCell>
      </TableRow>
    );
  });

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
      sx={{ zIndex: (theme) => theme.zIndex.modal + 3 }}
      open={channelInfoOpen}
      onClose={handleClose}
      PaperProps={{ sx: { bgcolor: "grey.500" } }}
    >
      <Grid container direction="column">
        <Grid item>
          <DialogTitle>
            {t(translationKeys.roomContext.channelInfo)}
          </DialogTitle>
        </Grid>
        <Divider></Divider>
        <Grid item>
          <Grid container>
            <Grid item>
              <DialogActions>
                <Button
                  variant="outlined"
                  onMouseUp={(e) => handlePasswordChange()}
                  onMouseDown={handlePasswordChange}
                >
                  {t(translationKeys.roomContext.changePassword)}
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
                  {t(translationKeys.roomContext.changeName)}
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
                    <TableCell>{t(translationKeys.createInfo.name)}</TableCell>
                    <TableCell>
                      {t(translationKeys.roomContext.status)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{listUsers}</TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
      <GetNameDialog
        open={openName}
        toggleOpen={closeNameDialog}
        channel={channel}
        bigSocket={bigSocket}
        toggleChannelInfo={toggleChannelInfo}
      ></GetNameDialog>
      <GetPasswordDialog
        open={openPassword}
        toggleOpen={closePasswordDialog}
        channel={channel}
        bigSocket={bigSocket}
        toggleChannelInfo={toggleChannelInfo}
      ></GetPasswordDialog>
    </Dialog>
  );
}
