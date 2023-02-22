import { Dialog, TextField } from "@mui/material";
import { useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";

export default function GetIdDialog({
  open,
  toggleOpen,
  channel,
  channelSocket,
}: {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom;
  channelSocket: ChannelSocket;
}) {
  const [input, setInput] = useState<string>("");

  const handleClose = () => {
    setInput("");
    toggleOpen(false);
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: any) => {
    if (e.key === "Enter") {
      channelSocket.inviteToChannel(channel, input)
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <TextField
        label="User-ID"
        value={input}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      ></TextField>
    </Dialog>
  );
}
