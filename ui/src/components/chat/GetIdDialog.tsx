import { Dialog, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelService from "../../services/channel.service";

export default function GetIdDialog({
  setAlertMsg,
  open,
  toggleOpen,
  channel,
  channelSocket,
}: {
  setAlertMsg: Dispatch<SetStateAction<string>>;
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | undefined;
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
      setAlertMsg("Failed to invite user");
      ChannelService.getUserByName(input)
        .then((resolve) => {
          channelSocket.inviteToChannel(channel, resolve.data.id);
        })
        .catch(() => {
          channelSocket.inviteToChannel(channel, undefined);
        });
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
