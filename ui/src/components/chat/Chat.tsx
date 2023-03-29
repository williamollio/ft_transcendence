import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import {
  messagesDto,
  failEvents,
  ContextMenu,
  RoomInvite,
} from "../../interfaces/chat.interface";
import { accessTypes, chatRoom } from "../../classes/chatRoom.class";
import AddChannelDialog from "./AddChannelDialog";
import RoomContextMenu from "./RoomContextMenu";
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
import { listenerWrapper } from "../../services/initSocket.service";

interface Props {
  channelSocket: ChannelSocket;
  userSocket: UserSocket;
  gameSocket: GameSocket;
}

export default function Chat(props: Props) {
  const { channelSocket, userSocket, gameSocket } = props;
  const theme = useTheme();

  const [open, toggleOpen] = useState(false);
  const [messages, setMessages] = useState<Array<messagesDto>>([]);
  const [currentRoom, setCurrentRoom] = useState<chatRoom | boolean>(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [invitePassword, toggleInvitePassword] = useState<boolean>(false);
  const [roomInvite, setRoomInvite] = useState<RoomInvite>({
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

  const handleSubmit = async (e: any) => {
    if (e.key === "Enter") {
      if (
        currentRoom &&
        typeof currentRoom !== "boolean" &&
        e.target.value.trim()
      ) {
        currentRoom.messages.push({
          message: `[${t(translationKeys.chatInfo.you)}]: ` + e.target.value,
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
    if (data.type === "PROTECTED") {
      setRoomInvite(data);
      toggleInvitePassword(true);
    } else {
      channelSocket.joinRoom(data.id);
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

  const roomLeftListener = (data: { userId: string; channelId: string }) => {
    let index = channelSocket.channels.findIndex(
      (element) => element.id === data.channelId
    );
    if (index >= 0) {
      ChannelService.getUserName(data.userId).then((res) => {
        channelSocket.channels[index].messages.push({
          message: `${res.data.name} ${t(translationKeys.chatInfo.userLeft)}`,
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
          message: `${res.data.name} ${t(translationKeys.chatInfo.userJoined)}`,
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
          type: ToastType.INVITE,
          title: t(translationKeys.invite.roomInvite) as string,
          message: `${t(translationKeys.invite.inviteTo) as string} ${data.name}`,
		  autoClose: false,
          onAccept: () => handleInviteSubmit(data),
          onRefuse: () => {},
        },
      });
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
          message: t(translationKeys.chatInfo.muted),
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
  };

  useEffect(() => {
    listenerWrapper(() => {
      if (channelSocket.socket.connected) {
        channelSocket.registerListener(
          "incomingMessage",
          incomingMessageListener
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
        return true;
      }
      return false;
    });
    return () => {
      listenerWrapper(() => {
        if (channelSocket.socket.connected) {
          channelSocket.removeListener("banSucceeded", banSuccessListener);
          channelSocket.removeListener("muteSucceeded", muteSuccessListener);
          channelSocket.removeListener(
            "incomingMessage",
            incomingMessageListener
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
          return true;
        }
        return false;
      });
    };
  }, [channelSocket, currentRoom, blockedUsers]);

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
          toggleOpen={toggleOpen}
          channelSocket={channelSocket}
          setNewChannel={setNewChannel}
          blockedUsers={blockedUsers}
        />
        <RoomContextMenu
          blockedUser={blockedUsers}
          refetchBlockedUsers={refetchBlockedUsers}
          userSocket={userSocket}
          setNewChannel={setNewChannel}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          channelSocket={channelSocket}
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
        dialogContent={t(translationKeys.chatInfo.passwordReq)!}
        label={t(translationKeys.createInfo.password)}
        type="password"
      ></GetTextInputDialog>
    </Paper>
  );
}
