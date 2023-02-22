import { Dialog, TextField } from "@mui/material";
import { useState } from "react";
import { user } from "../../interfaces/chat.interfaces";

export default function GetIdDialog({
  open,
  toggleOpen,
  user,
}: {
  open: boolean;
  toggleOpen: any;
  user: user | null;
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
      //submit invite to room with user.id and channel id
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <TextField
        label="Channel-ID"
        value={input}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      ></TextField>
    </Dialog>
  );
}
