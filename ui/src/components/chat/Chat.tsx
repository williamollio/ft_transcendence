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
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { ChannelTabs } from "./ChannelTabs";
import ChannelService from "../../services/channel.service";
import { useNavigate } from "react-router-dom";
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
import { RoutePath } from "../../interfaces/router.interface";
import UserContext from "./UserContext";

interface Props {
  channelSocket: ChannelSocket;
  userSocket: UserSocket;
  gameSocket: GameSocket;
}

export default function Chat(props: Props) {
  const { channelSocket, userSocket, gameSocket } = props;
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
    enabled: channelSocket.user.id !== "",
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
          userId: channelSocket.user.id,
          userName: channelSocket.user.name,
          content: e.target.value,
          channelId: currentRoom.id,
        });
        channelSocket.messageRoom({
          userId: channelSocket.user.id,
          userName: channelSocket.user.name,
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
      channelSocket.joinRoom(data.id);
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
        let index = channelSocket.channels.findIndex(
          (element) => element.id === data.messageInfo.channelId
        );
        if (index >= 0) {
          channelSocket.channels[index].messages.push({
            userId: data.messageInfo.userId,
            userName: data.messageInfo.userName,
            content: data.messageInfo.content,
            channelId: data.messageInfo.channelId,
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
          userId: data.userId,
          userName: res.data.name,
          content: `${t(translationKeys.chatInfo.userLeft)}`,
          channelId: data.channelId,
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
          userId: data.userId,
          userName: res.data.name,
          content: `${t(translationKeys.chatInfo.userJoined)}`,
          channelId: data.channelId,
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
          gameSocket.joinGame(data.game.mode, data.initiatingUser.id);
          navigate(RoutePath.GAME);
        },
        onRefuse: () => gameSocket.refuseInvite(data.initiatingUser.id),
      },
    });
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
      if (mutedChannel && mutedChannel.id) {
        mutedChannel.messages.push({
          userId: channelSocket.user.id,
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
        message: t(translationKeys.errorMessages.backendErrorMessage(event)) as string,
      },
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
        gameSocket.socket.on("invitedToGame", invitedToGameListener);
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
          gameSocket.socket.off("invitedToGame", invitedToGameListener);
          return true;
        }
        return false;
      });
    };
  }, [channelSocket, currentRoom, blockedUsers]);

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
                    (messagesDto.userId === channelSocket.user.id
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
          channelSocket={channelSocket}
          setNewChannel={setNewChannel}
          blockedUsers={blockedUsers}
        />
        <RoomContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          channelSocket={channelSocket}
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
            channelSocket={channelSocket}
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
          channelSocket.joinRoom(roomInvite.id, input);
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
        channelSocket={channelSocket}
        gameSocket={gameSocket}
      />
    </Paper>
  );
}
