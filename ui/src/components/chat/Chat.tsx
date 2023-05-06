import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import {
  messagesDto,
  failEvents,
  ContextMenu,
  RoomInvite,
  ChannelInfoContextMenu,
  user,
  GameMode,
} from "../../interfaces/chat.interface";
import { accessTypes, chatRoom } from "../../classes/chatRoom.class";
import AddChannelDialog from "./AddChannelDialog";
import RoomContextMenu from "./RoomContextMenu";
import { BigSocket } from "../../classes/BigSocket.class";
import { ChannelTabs } from "./ChannelTabs";
import ChannelService from "../../services/channel.service";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import GetTextInputDialog from "./GetTextInputDialog";
import { useTheme } from "@mui/material";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { ToastType } from "../../context/toast";
import { listenerWrapper } from "../../services/initSocket.service";
import { RoutePath } from "../../interfaces/router.interface";
import UserContext from "./UserContext";

interface Props {
  bigSocket: BigSocket;
}

export default function Chat(props: Props) {
  const { bigSocket } = props;
  const theme = useTheme();
  const scrollRef = useRef<HTMLLIElement | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useContext(TranscendanceContext);

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
  const [userContextMenu, setUserContextMenu] =
    useState<ChannelInfoContextMenu | null>(null);

  const {
    data: blockedUsers,
    isLoading,
    isError,
    isRefetching,
    refetch: refetchBlockedUsers,
  } = useQuery(["blocks"], ChannelService.fetchBlockedUsers, {
    enabled: bigSocket.user.id !== "",
  });

  const handleSubmit = async (e: any) => {
    if (e.key === "Enter") {
      if (
        currentRoom &&
        typeof currentRoom !== "boolean" &&
        currentRoom.id &&
        e.target.value.trim()
      ) {
        currentRoom.messages.push({
          userId: bigSocket.user.id,
          userName: bigSocket.user.name,
          content: e.target.value,
          channelId: currentRoom.id,
        });
        bigSocket.messageRoom({
          userId: bigSocket.user.id,
          userName: bigSocket.user.name,
          content: e.target.value,
          channelId: currentRoom.id,
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
      bigSocket.joinRoom(data.id);
      setRoomInvite({ id: "", type: "PRIVATE", name: "" });
    }
  };

  const handleUserContextMenu = (event: any, user: user, channelId: string) => {
    event.preventDefault();
    setUserContextMenu(
      userContextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            user: user,
            channelId: channelId,
          }
        : null
    );
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
      userId: string;
      userName: string;
      channelId: string;
      content: string;
    };
    sender: string;
  }) => {
    if (!isRefetching && !isLoading && !isError && blockedUsers) {
      if (!blockedUsers.some((element: string) => element === data.sender)) {
        let index = bigSocket.channels.findIndex(
          (element) => element.id === data.messageInfo.channelId
        );
        if (index >= 0) {
          bigSocket.channels[index].messages.push({
            userId: data.messageInfo.userId,
            userName: data.messageInfo.userName,
            content: data.messageInfo.content,
            channelId: data.messageInfo.channelId,
          });
          updateMessages(
            bigSocket.channels[index],
            data.messageInfo.channelId
          );
        }
      }
    }
  };

  const roomLeftListener = (data: { userId: string; channelId: string }) => {
    if (data.userId !== bigSocket.user.id) {
      let index = bigSocket.channels.findIndex(
        (element) => element.id === data.channelId
      );
      if (index >= 0) {
        ChannelService.getUserName(data.userId).then((res) => {
          bigSocket.channels[index].messages.push({
            userId: data.userId,
            userName: res.data.name,
            content: `${t(translationKeys.chatInfo.userLeft)}`,
            channelId: data.channelId,
          });
          updateMessages(bigSocket.channels[index], data.channelId);
        });
      }
    }
  };

  const roomJoinedListener = (data: { userId: string; channelId: string }) => {
    if (data.userId !== bigSocket.user.id) {
      let index = bigSocket.channels.findIndex(
        (element) => element.id === data.channelId
      );
      if (index >= 0) {
        ChannelService.getUserName(data.userId).then((res) => {
          bigSocket.channels[index].messages.push({
            userId: data.userId,
            userName: res.data.name,
            content: `${t(translationKeys.chatInfo.userJoined)}`,
            channelId: data.channelId,
          });
          updateMessages(bigSocket.channels[index], data.channelId);
        });
      }
    }
  };

  const inviteSucceededListener = (data: {
    id: string;
    name: string;
    type: accessTypes;
    invited: string;
  }) => {
    if (data.invited === bigSocket.user.id) {
      toast.dispatchTranscendanceState({
        type: TranscendanceStateActionType.TOGGLE_TOAST,
        toast: {
          type: ToastType.INVITE,
          title: t(translationKeys.invite.roomInvite) as string,
          message: `${t(translationKeys.invite.inviteTo) as string} ${
            data.name
          }`,
          autoClose: false,
          onAccept: () => handleInviteSubmit(data),
          onRefuse: () => {},
        },
      });
    }
  };

  const invitedToGameListener = (data: any) => {
    toast.dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.INVITE,
        title: t(translationKeys.invite.gameInvite) as string,
        message: `${data.initiatingUser.name} ${
          t(translationKeys.invite.inviteToGame) as string
        }
            ${data.game.mode === GameMode.CLASSIC ? "Classic" : "Mayhem"}`,
        autoClose: true,
        onAccept: () => {
          bigSocket.joinGame(data.game.mode, data.initiatingUser.id);
          navigate(RoutePath.GAME);
        },
        onRefuse: () => bigSocket.refuseInvite(data.initiatingUser.id),
      },
    });
  };

  const banSuccessListener = (result: {
    channelActionOnChannelId: string;
    channelActionTargetId: string;
  }) => {
    if (result.channelActionTargetId === bigSocket.user.id) {
      let bannedChannel = bigSocket.channels.find(
        (element) => element.id === result.channelActionOnChannelId
      );
      if (bannedChannel) bigSocket.deleteRoom(bannedChannel);
    }
  };

  const muteSuccessListener = (result: {
    channelActionOnChannelId: string;
    channelActionTargetId: string;
  }) => {
    if (result.channelActionTargetId === bigSocket.user.id) {
      const mutedChannel = bigSocket.channels.find(
        (element) => element.id === result.channelActionOnChannelId
      );
      if (mutedChannel && mutedChannel.id) {
        mutedChannel.messages.push({
          userId: bigSocket.user.id,
          userName: t(translationKeys.chatInfo.notice),
          content: t(translationKeys.chatInfo.muted),
          channelId: mutedChannel.id,
        });
        updateMessages(mutedChannel, result.channelActionOnChannelId);
      }
    }
  };

  const failedListener = (error: string, event: string) => {
    toast.dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.ERROR,
        title: error,
        message: t(
          translationKeys.errorMessages.backendErrorMessage(event)
        ) as string,
      },
    });
  };

  useEffect(() => {
    listenerWrapper(() => {
      if (bigSocket.socket.connected) {
        bigSocket.socket.on(
          "incomingMessage",
          incomingMessageListener
        );
        bigSocket.socket.on("roomLeft", roomLeftListener);
        bigSocket.socket.on("roomJoined", roomJoinedListener);
        bigSocket.socket.on(
          "inviteSucceeded",
          inviteSucceededListener
        );
        bigSocket.socket.on("banSucceeded", banSuccessListener);
        bigSocket.socket.on("muteSucceeded", muteSuccessListener);
        failEvents.forEach((element) => {
          bigSocket.socket.on(element, (error) =>
            failedListener(error, element)
          );
        });
        bigSocket.socket.on("invitedToGame", invitedToGameListener);
        return true;
      }
      return false;
    });
    return () => {
      listenerWrapper(() => {
        if (bigSocket.socket.connected) {
          bigSocket.socket.off("banSucceeded", banSuccessListener);
          bigSocket.socket.off("muteSucceeded", muteSuccessListener);
          bigSocket.socket.off(
            "incomingMessage",
            incomingMessageListener
          );
          bigSocket.socket.off("roomLeft", roomLeftListener);
          bigSocket.socket.off("roomJoined", roomJoinedListener);
          bigSocket.socket.off(
            "inviteSucceeded",
            inviteSucceededListener
          );
          failEvents.forEach((element) => {
            bigSocket.socket.off(element, failedListener);
          });
          bigSocket.socket.off("invitedToGame", invitedToGameListener);
          return true;
        }
        return false;
      });
    };
  }, [bigSocket, currentRoom, blockedUsers]);

  const listMessages = messages
    ? messages.map((messagesDto: messagesDto, index) => {
        if (messagesDto && messagesDto.content !== "") {
          return (
            <ListItem
              disablePadding
              sx={{ pl: "5px" }}
              ref={scrollRef}
              key={index}
            >
              <ListItemButton
                disableRipple
                disableGutters
                onClick={(event) =>
                  handleUserContextMenu(
                    event,
                    { id: messagesDto.userId, name: messagesDto.userName },
                    messagesDto.channelId
                  )
                }
                sx={{ maxWidth: "min-content", boxSizing: "border-box" }}
              >
                <Typography fontSize={15} sx={{ whiteSpace: "pre-wrap" }}>
                  {"[" +
                    (messagesDto.userId === bigSocket.user.id
                      ? t(translationKeys.chatInfo.you)
                      : messagesDto.userName) +
                    "]: "}
                </Typography>
              </ListItemButton>
              <ListItemText primary={messagesDto.content} />
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
          height: "85.9%", // TODO : responsiveness to be adapted at 42
        }}
      >
        <ChannelTabs
          currentRoom={currentRoom}
          setContextMenu={setContextMenu}
          contextMenu={contextMenu}
          toggleOpen={toggleOpen}
          bigSocket={bigSocket}
          setNewChannel={setNewChannel}
          blockedUsers={blockedUsers}
        />
        <RoomContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          bigSocket={bigSocket}
        ></RoomContextMenu>
        <Divider></Divider>
        <Grid container height="100%">
          <Grid item height="100%">
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
            bigSocket={bigSocket}
          ></AddChannelDialog>

          <Grid item alignSelf={"flex-end"}>
            <Box
              sx={{ bgcolor: "grey.300", width: "300px", height: "1rem" }}
            ></Box>
            <TextField
              label={t(translationKeys.chat)}
              sx={{ width: "300px", marginTop: "-1px" }}
              onKeyDown={handleSubmit}
            />
          </Grid>
        </Grid>
      </Box>
      <GetTextInputDialog
        open={invitePassword}
        toggleOpen={toggleInvitePassword}
        handleSubmit={(input: string) => {
          bigSocket.joinRoom(roomInvite.id, input);
          setRoomInvite({ id: "", type: "PRIVATE", name: "" });
        }}
        dialogContent={t(translationKeys.chatInfo.passwordReq)!}
        label={t(translationKeys.createInfo.password)}
        type="password"
      ></GetTextInputDialog>
      <UserContext
        blockedUser={blockedUsers}
        refetchBlockedUsers={refetchBlockedUsers}
        contextMenu={userContextMenu}
        setContextMenu={setUserContextMenu}
        bigSocket={bigSocket}
      />
    </Paper>
  );
}
