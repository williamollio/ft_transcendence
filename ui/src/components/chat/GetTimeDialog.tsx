import { Dialog, TextField } from "@mui/material";
import { useState } from "react";
import { user } from "../../interfaces/chat.interfaces";

export default function GetTimeDialog({
  open,
  toggleOpen,
  action,
  user,
}: {
  open: boolean;
  toggleOpen: any;
  action: "kick" | "mute";
  user: user | null;
}) {
  const [time, setTime] = useState<string>("");

  const handleClose = () => {
    setTime("");
    toggleOpen(false);
  };

  const handleChange = (e: any) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e: any) => {
    if (e.key === "Enter") {
      if (action === "kick") {
        //submit kick with time + user.id
      } else if (action === "mute") {
        //submit mute with time + user.id
      }
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <TextField
        type="number"
        label="Time in seconds"
        value={time}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      ></TextField>
    </Dialog>
  );
}
