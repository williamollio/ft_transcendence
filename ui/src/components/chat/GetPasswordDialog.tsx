import { Dialog, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";

export default function GetPasswordDialog({
  open,
  toggleOpen,
  channel,
  channelSocket,
}: {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | null;
  channelSocket: ChannelSocket;
}) {
  const [input, setInput] = useState<string>("");
  const [oldInput, setOldInput] = useState<string>("");

  const handleClose = () => {
    setInput("");
    setOldInput("");
    toggleOpen();
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleOldChange = (e: any) => {
    setOldInput(e.target.value);
  };

  const handleSubmit = (e: any) => {
    if (e.key === "Enter") {
      if (channel && channel.access === "PROTECTED" && oldInput !== "") {
        if (input !== "") {
          //send request to change password
          channelSocket.editRoom(channel, channel.access, oldInput, input);
        } else {
          //send request to remove password
          channelSocket.editRoom(channel, channel.access, oldInput);
        }
      } else if (channel && channel.access !== "PROTECTED" && input !== "") {
        //send request with input to change access type to PROTECTED
        channelSocket.editRoom(channel, "PROTECTED", undefined, input);
      }
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} onKeyDown={handleSubmit}>
      <DialogContent>
        Leave Password empty to remove Password protection
      </DialogContent>
      {channel && channel.access === "PROTECTED" ? (
        <TextField
          label="Old Password"
          type="password"
          value={oldInput}
          onChange={handleOldChange}
        ></TextField>
      ) : (
        false
      )}
      <TextField
        label="Password"
        type="password"
        value={input}
        onChange={handleChange}
      ></TextField>
    </Dialog>
  );
}
