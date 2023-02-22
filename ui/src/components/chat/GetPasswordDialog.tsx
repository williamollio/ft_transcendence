import { Dialog, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { chatRoom } from "../../classes/chatRoom.class";

export default function GetPasswordDialog({
  open,
  toggleOpen,
  channel,
}: {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | null;
}) {
  const [input, setInput] = useState<string>("");
  const [oldInput, setOldInput] = useState<string>("");

  const handleClose = () => {
    setInput("");
    setOldInput("");
    toggleOpen(false);
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
          //send request with oldInput and input
        } else {
          //send request to remove password
        }
      } else {
        //send request with input to change access type to PROTECTED
      }
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
		<DialogContent>Leave Password empty to remove Password protection</DialogContent>
      {channel && channel.access === "PROTECTED" ? (
        <TextField
          label="Old Password"
          type="password"
          value={oldInput}
          onChange={handleOldChange}
        ></TextField>
      ) : false}
      <TextField
        label="Password"
        type="password"
        value={input}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      ></TextField>
    </Dialog>
  );
}
