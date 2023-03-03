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
import { useEffect, useRef, useState } from "react";
import { messagesDto } from "../../interfaces/chat.interfaces";
import { accessTypes, chatRoom } from "../../classes/chatRoom.class";
import AddChannelDialog from "../../components/chat/AddChannelDialog";
import RoomContextMenu from "../../components/chat/RoomContextMenu";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { ChannelTabs } from "../../components/chat/ChannelTabs";
import ChannelService from "../../services/channel.service";
import { useLocation } from "react-router-dom";
import { UserSocket } from "../../classes/UserSocket.class";
import { fetchBlockedUsers } from "../../components/chat/hooks/blockedUsers.fetch";
import { useQuery } from "@tanstack/react-query";

interface Props {
  channelSocket: ChannelSocket;
  userSocket: UserSocket;
}

export default function Chat(props: Props) {
  const { channelSocket, userSocket } = props;
  const [open, toggleOpen] = useState(false);
  const [inputChat, setInputChat] = useState<string>("");
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
  const [roomIvite, setRoomInvite] = useState<{
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

  const {
    data: blockedUsers,
    isLoading,
    isError,
    refetch: refetchBlockedUsers,
  } = useQuery(["blocks"], fetchBlockedUsers, {
    enabled: channelSocket.user.id !== "",
  });

  useEffect(() => {
    if (location && location.state && location.state.id) {
      channelSocket.createDm(location.state.id); // not sure if that's how it's done
    }
  }, [location]);

  const handleChange = (e: any) => {
    setInputChat(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    if (e.key === "Enter") {
      if (currentRoom && typeof currentRoom !== "boolean" && inputChat !== "") {
        currentRoom.messages.push({
          message: "[You]: " + inputChat,
          room: currentRoom.id,
        });
        channelSocket.messageRoom({
          message: "[" + channelSocket.user.name + "]: " + inputChat,
          room: currentRoom.id,
        });
        updateMessages(currentRoom, undefined);
      }
      setInputChat("");
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
    if (!isLoading && !isError && blockedUsers) {
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
    setAlertMsg("Failed to send message");
    toggleAlert(true);
  };

  const roomLeftListener = (data: { userId: string; channelId: string }) => {
    let index = channelSocket.channels.findIndex(
      (element) => element.id === data.channelId
    );
    if (index >= 0) {
      ChannelService.getUserName(data.userId).then((res) => {
        channelSocket.channels[index].messages.push({
          message: `${res.data.name} left the channel`,
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
          message: `${res.data.name} joined the channel`,
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
  }) => {
    setRoomInvite(data);
    toggleInvited(true);
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
          message: "You have been muted for 30 seconds",
        });
        updateMessages(mutedChannel, result.channelActionOnChannelId);
      }
    }
  };

  const failedListener = (error: string) => {
    console.log(error);
    toggleAlert(true);
  };

  useEffect(() => {
    channelSocket.registerListener("incomingMessage", incomingMessageListener);
    channelSocket.registerListener(
      "messageRoomFailed",
      messageRoomFailedListener
    );
    channelSocket.registerListener("roomLeft", roomLeftListener);
    channelSocket.registerListener("roomJoined", roomJoinedListener);
    channelSocket.registerListener("inviteSucceeded", inviteSucceededListener);
    channelSocket.registerListener("banSucceeded", banSuccessListener);
    channelSocket.registerListener("muteSucceeded", muteSuccessListener);
    [
      "joinRoomError",
      "joinRoomFailed",
      "leaveRoomFailed",
      "createRoomFailed",
      "editRoomFailed",
      "createRoomFailed",
      "banFailed",
      "muteFailed",
      "updateRoleFailed",
    ].forEach((element) => {
      channelSocket.registerListener(element, failedListener);
    });
    return () => {
      channelSocket.removeListener("banSucceeded", banSuccessListener);
      channelSocket.removeListener("muteSucceeded", muteSuccessListener);
      channelSocket.removeListener("incomingMessage", incomingMessageListener);
      channelSocket.removeListener(
        "messageRoomFailed",
        messageRoomFailedListener
      );
      channelSocket.removeListener("roomLeft", roomLeftListener);
      channelSocket.removeListener("roomJoined", roomJoinedListener);
      channelSocket.removeListener("inviteSucceeded", inviteSucceededListener);
      [
        "joinRoomError",
        "joinRoomFailed",
        "leaveRoomFailed",
        "createRoomFailed",
        "editRoomFailed",
        "createRoomFailed",
        "banFailed",
        "muteFailed",
        "updateRoleFailed",
      ].forEach((element) => {
        channelSocket.removeListener(element, failedListener);
      });
    };
  }, [channelSocket.socket, currentRoom]);

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
    <>
      <Paper
        elevation={4}
        sx={{
          position: "absolute",
          top: "50%",
          left: "40px",
          width: "300px",
          height: "auto",
          bgcolor: "grey.600",
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
            height: "auto",
          }}
        >
          <>
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
            ></RoomContextMenu>
            <Divider></Divider>
            <Grid container>
              <Grid item>
                <List
                  dense
                  disablePadding
                  sx={{
                    color: "white",
                    bgcolor: "grey.700",
                    width: "300px",
                    position: "relative",
                    overflow: "auto",
                    height: "250px",
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
              <Grid item>
                <TextField
                  variant="filled"
                  size="small"
                  label="Chat"
                  sx={{ width: "300px" }}
                  value={inputChat}
                  onChange={handleChange}
                  onKeyDown={handleSubmit}
                />
              </Grid>
            </Grid>
          </>
        </Box>
        <Collapse in={invited}>
          <Alert sx={{ width: "auto" }} severity="success">
            You have been invited to {roomIvite.name}
          </Alert>
          <Grid container>
            <IconButton
              aria-label="Accept"
              color="inherit"
              size="small"
              onClick={() => {
                channelSocket.joinRoom(roomIvite.id, roomIvite.type);
                toggleAlert(false);
                setRoomInvite({ id: "", type: "PRIVATE", name: "" });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="Reject"
              color="inherit"
              size="small"
              onClick={() => {
                toggleAlert(false);
                setRoomInvite({ id: "", type: "PRIVATE", name: "" });
              }}
            >
              <CheckIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Collapse>
      </Paper>
    </>
  );
}
