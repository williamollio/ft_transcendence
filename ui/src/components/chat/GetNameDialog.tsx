import { Dialog, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";

export default function GetNameDialog({
  open,
  toggleOpen,
  channel,
  channelSocket,
}: {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | undefined;
  channelSocket: ChannelSocket;
}) {
  const [input, setInput] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");

  const handleClose = () => {
    setInput("");
    setNameInput("");
    toggleOpen();
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleNameChange = (e: any) => {
    setNameInput(e.target.value);
  };

  const handleSubmit = (e: any) => {
    if (e.key === "Enter") {
      if (
        channel &&
        (channel.access !== "PROTECTED" ||
          (channel.access === "PROTECTED" && input !== ""))
      ) {
        if (nameInput !== "") {
          channelSocket.editRoom(
            channel,
            channel.access,
            channel.access === "PROTECTED" ? input : undefined,
            undefined,
            nameInput
          );
        }
      }
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} onKeyDown={handleSubmit}>
      <DialogContent>Enter new Name of the channel</DialogContent>
      <TextField
        label="New name"
        type="string"
        value={nameInput}
        onChange={handleNameChange}
      ></TextField>
      <TextField
        label="Password"
        type="password"
        value={input}
        onChange={handleChange}
      ></TextField>
    </Dialog>
  );
}
