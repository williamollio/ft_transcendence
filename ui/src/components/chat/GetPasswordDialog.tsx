import { Dialog, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BigSocket } from "../../classes/BigSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { translationKeys } from "./constants";

interface Props {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | undefined;
  bigSocket: BigSocket;
  toggleChannelInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GetPasswordDialog(props: Props) {
  const { open, toggleOpen, channel, bigSocket, toggleChannelInfo } = props;
  const { t } = useTranslation();

  const [input, setInput] = useState<string>("");
  const [oldInput, setOldInput] = useState<string>("");

  const handleClose = () => {
    setInput("");
    setOldInput("");
    toggleOpen();
    toggleChannelInfo(false);
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
          bigSocket.editRoom(channel, channel.access, oldInput, input);
        } else {
          //send request to remove password
          bigSocket.editRoom(channel, "PUBLIC", oldInput);
        }
      } else if (channel && channel.access !== "PROTECTED" && input !== "") {
        //send request with input to change access type to PROTECTED
        bigSocket.editRoom(channel, "PROTECTED", undefined, input);
      }
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyDown={handleSubmit}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 3 }}
    >
      <DialogContent>
        {t(translationKeys.roomContext.leavePasswordEmpty)}
      </DialogContent>
      {channel && channel.access === "PROTECTED" ? (
        <TextField
          label={t(translationKeys.roomContext.oldPassword)}
          type="password"
          value={oldInput}
          onChange={handleOldChange}
        ></TextField>
      ) : (
        false
      )}
      <TextField
        label={t(translationKeys.createInfo.password)}
        type="password"
        value={input}
        onChange={handleChange}
      ></TextField>
    </Dialog>
  );
}
