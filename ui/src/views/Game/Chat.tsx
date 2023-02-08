import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Exception } from "sass";
// import io from "socket.io-client";

export class messagesDto {
  user?: string;
  message?: string;
  room?: string;

  constructor(user: string, message: string, room: string) {
    this.user = user;
    this.message = message;
    this.room = room;
  }
}

interface chatRoom {
  key: string;
  access: "public" | "private" | "password";
  password?: string;
  messages: messagesDto[];
}

var tabs: chatRoom[] = [{ key: "public", access: "public", messages: [] }];

// const socket = io("http://localhost:3001");

export default function Chat() {
  const [inputChat, setInputChat] = useState<string>();
  const [messages, setMessages] = useState<Array<messagesDto>>(
    tabs[0].messages
  );
  const [open, toggleOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState<chatRoom>({
    key: "",
    access: "public",
    password: "",
    messages: [],
  });
  const [pwDisable, setPwDisable] = useState<boolean>(true);
  const [currentRoom, setCurrentRoom] = useState(tabs[0]);

  const scrollRef = useRef<HTMLLIElement | null>(null);

  const handleChange = (e: any) => {
    setInputChat(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    if (e.key === "Enter" && currentRoom) {
      currentRoom.messages.push({
        message: inputChat,
        user: "test",
        room: currentRoom.key,
      });
    //   socket.emit("postMessage", {
    //     message: inputChat,
    //     user: "test",
    //     room: currentRoom.key,
    //   });
      setInputChat("");
    }
  };

//   useEffect(() => {
//     socket.on("receiveMessage", (msg: messagesDto) => {
//       let tmp: chatRoom | undefined = tabs.find(
//         (element) => element.key === msg.room
//       );
//       if (tmp) tmp.messages.push(msg);
//     });
//   }, [socket]);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setCurrentRoom(
      tabs[
        tabs.push({
          key: dialogValue.key,
          access: dialogValue.access,
          password: dialogValue.password,
          messages: dialogValue.messages,
        }) - 1
      ]
    );
    setMessages(dialogValue.messages);
    setDialogValue({ key: "", access: "public", password: "", messages: [] });
    toggleOpen(false);
  };

  const listMessages = messages.map((messagesDto: messagesDto, index) => {
    if (messagesDto && messagesDto.message !== "" && messagesDto.user !== "") {
      return (
        <ListItem disablePadding sx={{ pl: "5px" }} ref={scrollRef} key={index}>
          <ListItemText
            primary={messagesDto.user + ": " + messagesDto.message}
          />
        </ListItem>
      );
    }
  });

  const handleAccessChange = (e: any) => {
    let tmpCR: chatRoom = { ...dialogValue, access: e.target.value };
    if (tmpCR.access !== "password") {
      tmpCR.password = "";
      setPwDisable(true);
    } else setPwDisable(false);
    setDialogValue(tmpCR);
  };

  const handleClose = (e: any) => {
    setDialogValue({ key: "", access: "public", password: "", messages: [] });
    toggleOpen(false);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView();
  });

  const handleRoomChange = (event: SyntheticEvent, newValue: chatRoom) => {
    setCurrentRoom(newValue);
  };

  const newRoom = () => {
    setCurrentRoom(currentRoom);
    setDialogValue({ key: "", access: "public", password: "", messages: [] });
    toggleOpen(true);
  };

  return (
    <>
      <Paper elevation={4}>
        <Box
          sx={{
            width: "300px",
            height: "300px",
          }}
        >
          <Grid container>
            <Grid item>
              <Tabs
                value={currentRoom}
                onChange={handleRoomChange}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    value={tab}
                    key={tab.key}
                    label={tab.key}
                    onClick={() => {
                      setMessages(tab.messages);
                    }}
                  ></Tab>
                ))}
                <Tab icon={<AddIcon />} onClick={newRoom}></Tab>
              </Tabs>
            </Grid>
            <Grid item>
              <List
                disablePadding
                sx={{
                  maxWidth: 300,
                  minWidth: 300,
                  bgcolor: "background.paper",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 300,
                  minHeight: 300,
                }}
              >
                {listMessages}
              </List>
            </Grid>
            <Grid item>
              <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleFormSubmit}>
                  <Grid container>
                    <Grid item>
                      <DialogTitle>Create new channel</DialogTitle>
                    </Grid>
                    <Grid item>
                      <DialogContent>
                        <Grid container spacing="20px">
                          <Grid item>
                            <DialogContentText>
                              Please enter channel name, accessibility and
                              password.
                            </DialogContentText>
                          </Grid>
                          <Grid item>
                            <TextField
                              variant="outlined"
                              size="small"
                              autoFocus
                              id="name"
                              value={dialogValue.key}
                              onChange={(event) =>
                                setDialogValue({
                                  ...dialogValue,
                                  key: event.target.value,
                                })
                              }
                              label="name"
                              type="text"
                            />
                          </Grid>
                          <Grid item>
                            <Select
                              size="small"
                              label="access"
                              type="string"
                              variant="outlined"
                              value={dialogValue.access}
                              onChange={handleAccessChange}
                            >
                              <MenuItem value="public">public</MenuItem>
                              <MenuItem value="private">private</MenuItem>
                              <MenuItem value="password">password</MenuItem>
                            </Select>
                          </Grid>
                          <Grid item>
                            <TextField
                              size="small"
                              disabled={pwDisable}
                              id="name"
                              value={dialogValue.password}
                              onChange={(event) =>
                                setDialogValue({
                                  ...dialogValue,
                                  password: event.target.value,
                                })
                              }
                              label="password"
                              type="string"
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </DialogContent>
                    </Grid>
                    <Grid item>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </form>
              </Dialog>
            </Grid>
            <Grid item>
              <TextField
                size="small"
                label="Chat"
                sx={{ width: "300px" }}
                value={inputChat}
                onChange={handleChange}
                onKeyDown={handleSubmit}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}
