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

  useEffect(() => {
    if (location && location.state) {
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
      }
      setInputChat("");
    }
  };

  useEffect(() => {
    channelSocket.socket.on(
      "incomingMessage",
      (incomingMessage: { channelId: string; content: string }) => {
        let index = channelSocket.channels.findIndex(
          (element) => element.id === incomingMessage.channelId
        );
        if (index >= 0)
          channelSocket.channels[index].messages.push({
            message: incomingMessage.content,
            room: incomingMessage.channelId,
          });
      }
    );
    channelSocket.socket.on("messageRoomFailed", () => {
      setAlertMsg("Failed to send message");
      toggleAlert(true);
    });
    channelSocket.socket.on("roomLeft", (userId: string, channelId: string) => {
      let index = channelSocket.channels.findIndex(
        (element) => element.id === channelId
      );
      if (index >= 0) {
        ChannelService.getUserName(userId).then((res) => {
          channelSocket.channels[index].messages.push({
            message: `${res.data.name} left the channel`,
            room: channelId,
          });
        });
      }
    });
    channelSocket.socket.on(
      "roomJoined",
      (userId: string, channelId: string) => {
        let index = channelSocket.channels.findIndex(
          (element) => element.id === channelId
        );
        if (index >= 0) {
          ChannelService.getUserName(userId).then((res) => {
            channelSocket.channels[index].messages.push({
              message: `${res.data.name} joined the channel`,
              room: channelId,
            });
          });
        }
      }
    );
    channelSocket.socket.on(
      "inviteSucceeded",
      (data: { id: string; name: string; type: accessTypes }) => {
        setRoomInvite(data);
        toggleInvited(true);
      }
    );
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
      channelSocket.socket.on(element, (error) => {
        console.log(error);
        toggleAlert(true);
      });
    });
    return () => {
      [
        "incomingMessage",
        "messageRoomFailed",
        "joinRoomError",
        "joinRoomFailed",
        "leaveRoomFailed",
        "createRoomFailed",
        "editRoomFailed",
        "createRoomFailed",
        "inviteSucceeded",
        "banFailed",
        "muteFailed",
        "updateRoleFailed",
        "roomLeft",
        "roomJoined",
      ].forEach((element) => {
        channelSocket.socket.off(element);
      });
    };
  }, [channelSocket.socket]);

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
