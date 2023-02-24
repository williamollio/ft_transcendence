import { Dialog, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { chatRoom } from "../../classes/chatRoom.class";

export default function GetNameDialog({
  open,
  toggleOpen,
  channel,
}: {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | null;
}) {
  const [input, setInput] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");

  const handleClose = () => {
    setInput("");
    setNameInput("");
    toggleOpen(false);
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleNameChange = (e: any) => {
    setNameInput(e.target.value);
  };

  const handleSubmit = (e: any) => {
    if (e.key === "Enter") {
      if (channel && channel.access === "PROTECTED" && input !== "") {
        if (nameInput !== "") {
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
        onKeyDown={handleSubmit}
      ></TextField>
    </Dialog>
  );
}
