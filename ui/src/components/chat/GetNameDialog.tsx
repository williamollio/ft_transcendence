import { Dialog, DialogContent, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { translationKeys } from "./constants";
import { TranscendanceContext } from "../../context/transcendance-context";
import { ToastType } from "../../context/toast";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";

interface Props {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | undefined;
  channelSocket: ChannelSocket;
  toggleChannelInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GetNameDialog(props: Props) {
  const { open, toggleOpen, channel, channelSocket, toggleChannelInfo } = props;
  const { t } = useTranslation();

  const [input, setInput] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");

  const toast = useContext(TranscendanceContext);

  const handleClose = () => {
    setInput("");
    setNameInput("");
    toggleOpen();
    toggleChannelInfo(false);
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
        } else {
          toast.dispatchTranscendanceState({
            type: TranscendanceStateActionType.TOGGLE_TOAST,
            toast: {
              type: ToastType.ERROR,
              title: t(translationKeys.createInfo.name) as string,
              message: `${
                t(translationKeys.errorMessages.channelNameEmpty) as string
              }`,
            },
          });
        }
      } else if (channel && channel.access === "PROTECTED" && input === "") {
        toast.dispatchTranscendanceState({
          type: TranscendanceStateActionType.TOGGLE_TOAST,
          toast: {
            type: ToastType.ERROR,
            title: t(translationKeys.createInfo.password) as string,
            message: `${
              t(translationKeys.errorMessages.passwordEmpty) as string
            }`,
          },
        });
      }
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} onKeyDown={handleSubmit}>
      <DialogContent>
        {t(translationKeys.roomContext.newNameOfChannel)}
      </DialogContent>
      <TextField
        label={t(translationKeys.roomContext.newName)}
        type="string"
        value={nameInput}
        onChange={handleNameChange}
      ></TextField>
      {channel?.access === "PROTECTED" ? (
        <TextField
          label={t(translationKeys.createInfo.password)}
          type="password"
          value={input}
          onChange={handleChange}
        ></TextField>
      ) : (
        false
      )}
    </Dialog>
  );
}
