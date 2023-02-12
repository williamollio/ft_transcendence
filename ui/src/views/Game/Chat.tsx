import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import usersService from "../../services/users.service";
import { User } from "../../interfaces/user.interface";
import CloseIcon from "@mui/icons-material/Close";
import { chatRoom, messagesDto } from "./interfaces/chat.interfaces";
import { createForm } from "./components/createChannelForm";
import { joinForm } from "./components/joinChannelForm";

// import io from "socket.io-client";

var tabs: chatRoom[] = [{ key: "public", access: "public", messages: [] }];

// const socket = io("http://localhost:3001");

export default function Chat() {
  const [inputChat, setInputChat] = useState<string>("");
  const [messages, setMessages] = useState<Array<messagesDto>>(
    tabs[0].messages
  );
  const [open, toggleOpen] = useState(false);
  const [pwDisable, setPwDisable] = useState<boolean>(true);
  const [currentRoom, setCurrentRoom] = useState(tabs[0]);
  const [user, setUser] = useState<User>();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("Channel name can not be empty!");
  const [formSelection, setFormSelection] = useState<number>(0);
  const [dialogJoinValue, setDialogJoinValue] = useState({
    key: "",
    password: "",
  });
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    room: chatRoom;
  } | null>(null);
  const [dialogValue, setDialogValue] = useState<chatRoom>({
    key: "",
    access: "public",
    password: "",
    messages: [],
  });

  const scrollRef = useRef<HTMLLIElement | null>(null);

  const handleChange = (e: any) => {
    setInputChat(e.target.value);
  };

  // const id = "1";
  // async function fetchCurrentUser() {
  //   const currentUser = (await usersService.getUser(id)).data;
  //   if (!currentUser) console.log("Failed to fetch current User!");
  //   setUser(currentUser);
  // }

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
    }
    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e: any) => {
    if (e.key === "Enter" && currentRoom && inputChat !== "") {
      let userName = "missing";
      if (user) userName = user.name;
      currentRoom.messages.push({
        message: inputChat,
        user: userName,
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

  const receiveUserList = (dto: string) => {
    currentRoom.users = new Map(Object.entries(JSON.parse(dto)));
  };

  //   useEffect(() => {
  //     socket.on("receiveMessage", (msg: string) => {
  //       let tmp: chatRoom | undefined = tabs.find(
  //         (element) => element.key === msg.room
  //       );
  //       if (tmp) tmp.messages.push(msg);
  //     });
  //      socket.on("receiveUserList", (msg: string) => receiveUserList(msg))
  //   }, [socket]);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (formSelection === 1) {
      if (dialogValue.key !== "") {
        if (dialogValue.access !== "password" || dialogValue.password !== "") {
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
          setDialogValue({
            key: "",
            access: "public",
            password: "",
            messages: [],
          });
          toggleOpen(false);
        } else setAlertOpen(true);
      } else setAlertOpen(true);
    } else {
      toggleOpen(false);
      // try to join room
    }
  };

  const listMessages = messages.map((messagesDto: messagesDto, index) => {
    if (messagesDto && messagesDto.message !== "" && messagesDto.user !== "") {
      return (
        <ListItem disablePadding sx={{ pl: "5px" }} ref={scrollRef} key={index}>
          <ListItemText
            primary={"[" + messagesDto.user + "]: " + messagesDto.message}
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
    if (formSelection === 1)
      setDialogValue({
        key: "",
        access: "public",
        password: "",
        messages: [],
      });
    else setDialogJoinValue({ key: "", password: "" });
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
    setDialogValue({
      key: "",
      access: "public",
      password: "",
      messages: [],
    });
    toggleOpen(true);
  };

  useEffect(() => {
    if (dialogValue.key === "") setAlert("Channel name can not be empty!");
    else if (dialogValue.access === "password" && dialogValue.password === "")
      setAlert("Password can not be empty");
    else setAlertOpen(false);
  }, [dialogValue]);

  const removeRoom = () => {
    if (contextMenu && contextMenu.room) {
      let index = tabs.findIndex(
        (element: chatRoom) => element === contextMenu.room
      );
      if (index > 0) {
        tabs.splice(index, 1);
        setCurrentRoom(tabs[index - 1]);
        setMessages(tabs[index - 1].messages);
      }
    }
    setContextMenu(null);
  };

  const handleContextMenu = (event: any, cRoom: chatRoom) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            room: cRoom,
          }
        : null
    );
  };

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const handleFormSelection = (e: SyntheticEvent, newValue: number) => {
    setFormSelection(newValue);
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
          <Tabs
            sx={{ width: "300px" }}
            value={currentRoom}
            onChange={handleRoomChange}
            variant="scrollable"
          >
            {tabs.map((tab) => (
              <Tab
                sx={{
                  color: "white",
                  minWidth: "30px",
                  width: "auto",
                  maxWidth: "100px",
                }}
                value={tab}
                key={tab.key}
                onContextMenu={(e) => handleContextMenu(e, tab)}
                label={
                  <Grid container alignItems="center">
                    <Grid item>{tab.key}</Grid>
                  </Grid>
                }
                onClick={() => {
                  setMessages(tab.messages);
                }}
              ></Tab>
            ))}
            <Tab
              sx={{ width: "30px", minWidth: "30px" }}
              icon={<AddIcon />}
              onClick={newRoom}
            ></Tab>
          </Tabs>
          <Menu
            open={contextMenu !== null}
            onClose={handleContextClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={removeRoom}>Remove</MenuItem>
          </Menu>
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
            <Dialog open={open} onClose={handleClose}>
              <>
                <Collapse in={alertOpen}>
                  <Alert
                    sx={{ width: "auto" }}
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setAlertOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {alert}
                  </Alert>
                </Collapse>
                <Tabs value={formSelection} onChange={handleFormSelection}>
                  <Tab key={0} value={0} label="Join"></Tab>
                  <Tab key={1} value={1} label="Create"></Tab>
                </Tabs>
                <form onSubmit={handleFormSubmit}>
                  {(() => {
                    if (formSelection === 0) {
                      return joinForm(dialogJoinValue, setDialogJoinValue);
                    } else {
                      return createForm(dialogValue, setDialogValue);
                    }
                  })()}
                </form>
              </>
            </Dialog>
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
        </Box>
      </Paper>
    </>
  );
}
