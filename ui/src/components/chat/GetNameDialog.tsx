import { Dialog, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { translationKeys } from "./constants";

interface Props {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | undefined;
  channelSocket: ChannelSocket;
}

export default function GetNameDialog(props: Props) {
  const { open, toggleOpen, channel, channelSocket } = props;
  const { t } = useTranslation();

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
      <DialogContent>{t(translationKeys.newNameOfChannel)}</DialogContent>
      <TextField
        label={t(translationKeys.newName)}
        type="string"
        value={nameInput}
        onChange={handleNameChange}
      ></TextField>
      <TextField
        label={t(translationKeys.password)}
        type="password"
        value={input}
        onChange={handleChange}
      ></TextField>
    </Dialog>
  );
}
