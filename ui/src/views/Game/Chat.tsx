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
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { messagesDto } from "../../interfaces/chat.interfaces";
import { chatRoom } from "../../classes/chatRoom.class";
import AddChannelDialog from "../../components/chat/AddChannelDialog";
import RoomContextMenu from "../../components/chat/RoomContextMenu";
import CloseIcon from "@mui/icons-material/Close";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { UserSocket } from "../../classes/UserSocket.class";

const channelSocket: ChannelSocket = new ChannelSocket();
const userSocket: UserSocket = new UserSocket();

export default function Chat() {
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

  const scrollRef = useRef<HTMLLIElement | null>(null);

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
    channelSocket.socket.on("incomingMessage", (event: any, ...args: any) => {
      let index = channelSocket.channels.findIndex((element) => element.id === args.channelId);
	  if (index >= 0)
		channelSocket.channels[index].messages.push(args.content);
    });
	channelSocket.socket.on("messageRoomFailed", () => {
		
	});
  }, [channelSocket]);

  const listMessages = messages
    ? messages.map((messagesDto: messagesDto, index) => {
        if (
          messagesDto &&
          messagesDto.message !== ""
        ) {
          return (
            <ListItem
              disablePadding
              sx={{ pl: "5px" }}
              ref={scrollRef}
              key={index}
            >
              <ListItemText
                primary={messagesDto.message}
              />
            </ListItem>
          );
        }
      })
    : false;

  const newRoom = () => {
    setCurrentRoom(currentRoom);
    toggleOpen(true);
  };

  //   const testAddUsers = (room: chatRoom | boolean) => {
  //     if (typeof room !== "boolean") {
  //       room.users.push({ id: "1", name: "TEST", rank: "Owner" });
  //       room.users.push({ id: "2", name: "TEST", rank: "Admin" });
  //       room.users.push({ id: "3", name: "TEST", rank: "" });
  //       room.users.push({ id: "4", name: "TEST", rank: "" });
  //       room.users.push({ id: "5", name: "TEST", rank: "" });
  //       room.users.push({ id: "6", name: "TEST", rank: "" });
  //       room.users.push({ id: "7", name: "TEST", rank: "" });
  //       room.users.push({ id: "8", name: "TEST", rank: "" });
  //       room.users.push({ id: "9", name: "TEST", rank: "" });
  //       room.users.push({ id: "10", name: "TEST", rank: "" });
  //       room.users.push({ id: "11", name: "TEST", rank: "" });
  //       room.users.push({ id: "12", name: "TEST", rank: "" });
  //       room.users.push({ id: "13", name: "TEST", rank: "" });
  //     }
  //   };

  //   useEffect(() => {
  //     channels[channels.length - 1]
  //       ? testAddUsers(channels[channels.length - 1])
  //       : false;
  //   }, [channels.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView();
  });

  const handleRoomChange = (event: SyntheticEvent, newValue: chatRoom) => {
    setCurrentRoom(newValue);
  };

  const handleContextMenu = (event: any, cRoom: chatRoom) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            channel: cRoom,
          }
        : null
    );
  };

  const setNewChannel = (newChannel: chatRoom) => {
    setCurrentRoom(newChannel);
    setMessages(newChannel.messages);
  };

  return (
    <>
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
      <Paper
        elevation={4}
        sx={{
          position: "absolute",
          top: "50%",
          left: "40px",
          width: "300px",
          height: "364px",
          bgcolor: "grey.600",
        }}
      >
        <Box
          sx={{
            width: "300px",
            height: "300px",
          }}
        >
          <>
            <Tabs
              sx={{ width: "300px" }}
              value={currentRoom}
              onChange={handleRoomChange}
              variant="scrollable"
            >
              {channelSocket.channels.map((channel) => {
                return (
                  <Tab
                    sx={{
                      color: "white",
                      minWidth: "30px",
                      width: "auto",
                      maxWidth: "100px",
                    }}
                    value={channel}
                    key={channel.key}
                    onContextMenu={(e) => handleContextMenu(e, channel)}
                    label={
                      <Grid container alignItems="center">
                        <Grid item>{channel.key}</Grid>
                      </Grid>
                    }
                    onClick={() => {
                      setMessages(channel.messages);
                    }}
                  ></Tab>
                );
              })}
              <Tab
                sx={{ width: "30px", minWidth: "30px" }}
                icon={<AddIcon />}
                onClick={newRoom}
              ></Tab>
            </Tabs>
            <RoomContextMenu
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              channels={channelSocket.channels}
              setCurrentRoom={setCurrentRoom}
              setMessages={setMessages}
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
                setNewChannel={setNewChannel}
                channelSocket={channelSocket}
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
      </Paper>
    </>
  );
}
