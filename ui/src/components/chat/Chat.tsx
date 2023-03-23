import {
  Alert,
  Box,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { messagesDto, failEvents } from "../../interfaces/chat.interface";
import { accessTypes, chatRoom } from "../../classes/chatRoom.class";
import AddChannelDialog from "./AddChannelDialog";
import RoomContextMenu from "./RoomContextMenu";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { ChannelTabs } from "./ChannelTabs";
import ChannelService from "../../services/channel.service";
import { useLocation } from "react-router-dom";
import { UserSocket } from "../../classes/UserSocket.class";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import { GameSocket } from "../../classes/GameSocket.class";
import GetTextInputDialog from "./GetTextInputDialog";
import { useTheme } from "@mui/material";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { ToastType } from "../../context/toast";

interface Props {
  channelSocket: ChannelSocket;
  userSocket: UserSocket;
  gameSocket: GameSocket;
}

export default function Chat(props: Props) {
  const { channelSocket, userSocket, gameSocket } = props;
  const theme = useTheme();

  const [open, toggleOpen] = useState(false);
  //   const [inputChat, setInputChat] = useState<string>("");
  const [messages, setMessages] = useState<Array<messagesDto>>([]);
  const [currentRoom, setCurrentRoom] = useState<chatRoom | boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    channel: chatRoom;
  } | null>(null);
  const [alert, toggleAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [invited, toggleInvited] = useState<boolean>(false);
  const [invitePassword, toggleInvitePassword] = useState<boolean>(false);
  const [roomInvite, setRoomInvite] = useState<{
    id: string;
    name: string;
    type: accessTypes;
  }>({
    id: "",
    type: "PRIVATE",
    name: "",
  });
  const scrollRef = useRef<HTMLLIElement | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

  const toast = useContext(TranscendanceContext);

  const {
    data: blockedUsers,
    isLoading,
    isError,
    isRefetching,
    refetch: refetchBlockedUsers,
  } = useQuery(["blocks"], ChannelService.fetchBlockedUsers, {
    enabled: channelSocket.user.id !== "",
  });

  useEffect(() => {
    if (location && location.state && location.state.id) {
      channelSocket.createDm(location.state.id); // TODO : william to implement
    }
  }, [location]);

  //   const handleChange = (e: any) => {
  //     setInputChat(e.target.value);
  //   };

  const handleSubmit = async (e: any) => {
    if (e.key === "Enter") {
      if (
        currentRoom &&
        typeof currentRoom !== "boolean" &&
        e.target.value.trim()
      ) {
        currentRoom.messages.push({
          message: `[${t(translationKeys.you)}]: ` + e.target.value,
          room: currentRoom.id,
        });
        channelSocket.messageRoom({
          message: "[" + channelSocket.user.name + "]: " + e.target.value,
          room: currentRoom.id,
        });
        updateMessages(currentRoom, undefined);
      }
      e.target.value = "";
    }
  };

  const handleInviteSubmit = (data: {
    id: string;
    type: accessTypes;
    name: string;
  }) => {
    // setAlertMsg(t(translationKeys.errorMessages.joinChannelFail) as string);
    if (data.type === "PROTECTED") {
      setRoomInvite(data);
      toggleInvitePassword(true);
    } else {
      channelSocket.joinRoom(data.id);
      //   toggleInvited(false);
      setRoomInvite({ id: "", type: "PRIVATE", name: "" });
    }
  };

  const updateMessages = (
    channel: chatRoom,
    incChannelId: string | undefined
  ) => {
    if (
      typeof incChannelId === "undefined" ||
      (typeof currentRoom !== "boolean" && incChannelId === currentRoom.id)
    ) {
      const newList: Array<messagesDto> = [];
      channel.messages.forEach((element) => {
        newList.push(element);
      });
      setMessages(newList);
    }
  };

  const incomingMessageListener = (data: {
    messageInfo: {
      channelId: string;
      content: string;
    };
    sender: string;
  }) => {
    if (!isRefetching && !isLoading && !isError && blockedUsers) {
      if (!blockedUsers.some((element: string) => element === data.sender)) {
        let index = channelSocket.channels.findIndex(
          (element) => element.id === data.messageInfo.channelId
        );
        if (index >= 0) {
          channelSocket.channels[index].messages.push({
            message: data.messageInfo.content,
            room: data.messageInfo.channelId,
          });
          updateMessages(
            channelSocket.channels[index],
            data.messageInfo.channelId
          );
        }
      }
    }
  };

  const messageRoomFailedListener = () => {
    setAlertMsg(t(translationKeys.errorMessages.messageSendFail) as string);
    toggleAlert(true);
  };

  const roomLeftListener = (data: { userId: string; channelId: string }) => {
    let index = channelSocket.channels.findIndex(
      (element) => element.id === data.channelId
    );
    if (index >= 0) {
      ChannelService.getUserName(data.userId).then((res) => {
        channelSocket.channels[index].messages.push({
          message: `${res.data.name} ${t(translationKeys.userLeft)}`,
          room: data.channelId,
        });
        updateMessages(channelSocket.channels[index], data.channelId);
      });
    }
  };

  const roomJoinedListener = (data: { userId: string; channelId: string }) => {
    let index = channelSocket.channels.findIndex(
      (element) => element.id === data.channelId
    );
    if (index >= 0) {
      ChannelService.getUserName(data.userId).then((res) => {
        channelSocket.channels[index].messages.push({
          message: `${res.data.name} ${t(translationKeys.userJoined)}`,
          room: data.channelId,
        });
        updateMessages(channelSocket.channels[index], data.channelId);
      });
    }
  };

  const inviteSucceededListener = (data: {
    id: string;
    name: string;
    type: accessTypes;
    invited: string;
  }) => {
    if (data.invited === channelSocket.user.id) {
      toast.dispatchTranscendanceState({
        type: TranscendanceStateActionType.TOGGLE_TOAST,
        toast: {
          type: ToastType.SUCCESS,
          title: "Invited to Room",
          message: t(translationKeys.inviteTo) as string,
          onAccept: () => handleInviteSubmit(data),
          onRefuse: () => {},
        },
      });
      //   toggleInvited(true);
    }
  };

  const banSuccessListener = (result: {
    channelActionOnChannelId: string;
    channelActionTargetId: string;
  }) => {
    if (result.channelActionTargetId === channelSocket.user.id) {
      let bannedChannel = channelSocket.channels.find(
        (element) => element.id === result.channelActionOnChannelId
      );
      if (bannedChannel) channelSocket.deleteRoom(bannedChannel);
    }
  };

  const muteSuccessListener = (result: {
    channelActionOnChannelId: string;
    channelActionTargetId: string;
  }) => {
    if (result.channelActionTargetId === channelSocket.user.id) {
      const mutedChannel = channelSocket.channels.find(
        (element) => element.id === result.channelActionOnChannelId
      );
      if (mutedChannel) {
        mutedChannel.messages.push({
          message: t(translationKeys.muted),
        });
        updateMessages(mutedChannel, result.channelActionOnChannelId);
      }
    }
  };

  const failedListener = (error: string, event: string) => {
    toast.dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: { type: ToastType.ERROR, title: error, message: error },
    });
    // toggleAlert(true);
  };

  useEffect(() => {
    if (channelSocket.socket.connected) {
      channelSocket.registerListener(
        "incomingMessage",
        incomingMessageListener
      );
      channelSocket.registerListener(
        "messageRoomFailed",
        messageRoomFailedListener
      );
      channelSocket.registerListener("roomLeft", roomLeftListener);
      channelSocket.registerListener("roomJoined", roomJoinedListener);
      channelSocket.registerListener(
        "inviteSucceeded",
        inviteSucceededListener
      );
      channelSocket.registerListener("banSucceeded", banSuccessListener);
      channelSocket.registerListener("muteSucceeded", muteSuccessListener);
      failEvents.forEach((element) => {
        channelSocket.registerListener(element, (error) =>
          failedListener(error, element)
        );
      });
    }
    return () => {
      if (channelSocket.socket.connected) {
        channelSocket.removeListener("banSucceeded", banSuccessListener);
        channelSocket.removeListener("muteSucceeded", muteSuccessListener);
        channelSocket.removeListener(
          "incomingMessage",
          incomingMessageListener
        );
        channelSocket.removeListener(
          "messageRoomFailed",
          messageRoomFailedListener
        );
        channelSocket.removeListener("roomLeft", roomLeftListener);
        channelSocket.removeListener("roomJoined", roomJoinedListener);
        channelSocket.removeListener(
          "inviteSucceeded",
          inviteSucceededListener
        );
        failEvents.forEach((element) => {
          channelSocket.removeListener(element, failedListener);
        });
      }
    };
  }, [
    channelSocket.socket,
    currentRoom,
    blockedUsers,
    channelSocket.socket.connected,
  ]);

  const listMessages = messages
    ? messages.map((messagesDto: messagesDto, index) => {
        if (messagesDto && messagesDto.message !== "") {
          return (
            <ListItem
              disablePadding
              sx={{ pl: "5px" }}
              ref={scrollRef}
              key={index}
            >
              <ListItemText primary={messagesDto.message} />
            </ListItem>
          );
        }
      })
    : false;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView();
  });

  const setNewChannel = (newChannel: chatRoom | boolean) => {
    setCurrentRoom(newChannel);
    if (typeof newChannel === "boolean") {
      setMessages(new Array<messagesDto>());
    } else setMessages(newChannel.messages);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        overflow: "auto",
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.primary.main,
        marginBottom: "2rem",
        boxShadow: "none",
      }}
    >
      <Collapse in={alert}>
        <Alert
          sx={{ width: "auto" }}
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                toggleAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertMsg}
        </Alert>
      </Collapse>
      <Box
        sx={{
          width: "300px",
          height: "87.9%", // TODO : responsiveness to be adapted
        }}
      >
        <ChannelTabs
          currentRoom={currentRoom}
          setContextMenu={setContextMenu}
          contextMenu={contextMenu}
          toggleAlert={toggleAlert}
          toggleOpen={toggleOpen}
          channelSocket={channelSocket}
          setNewChannel={setNewChannel}
        />
        <RoomContextMenu
          blockedUser={blockedUsers}
          refetchBlockedUsers={refetchBlockedUsers}
          userSocket={userSocket}
          setNewChannel={setNewChannel}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          channelSocket={channelSocket}
          setAlertMsg={setAlertMsg}
          toggleAlert={toggleAlert}
          gameSocket={gameSocket}
        ></RoomContextMenu>
        <Divider></Divider>
        <Grid container maxWidth="100%" height="100%" flexDirection="column">
          <Grid item flexGrow={1} sx={{ maxHeight: "90%" }}>
            <List
              dense
              disablePadding
              sx={{
                color: "black",
                bgcolor: "grey.300",
                width: "300px",
                overflow: "auto",
                height: "100%",
              }}
            >
              {listMessages}
            </List>
          </Grid>
          <AddChannelDialog
            open={open}
            toggleOpen={toggleOpen}
            channelSocket={channelSocket}
            setAlertMsg={setAlertMsg}
            toggleAlert={toggleAlert}
          ></AddChannelDialog>
          <Grid item alignSelf={"flex-end"}>
            <TextField
              variant="filled"
              size="small"
              label={t(translationKeys.chat)}
              sx={{ width: "300px", input: { color: "white" } }}
              onKeyDown={handleSubmit}
            />
          </Grid>
        </Grid>
      </Box>
      <GetTextInputDialog
        open={invitePassword}
        toggleOpen={toggleInvitePassword}
        handleSubmit={(input: string) => {
          channelSocket.joinRoom(roomInvite.id, input);
          setRoomInvite({ id: "", type: "PRIVATE", name: "" });
        }}
        dialogContent={t(translationKeys.passwordReq)!}
        label={t(translationKeys.password)}
        type="password"
      ></GetTextInputDialog>
    </Paper>
  );
}
