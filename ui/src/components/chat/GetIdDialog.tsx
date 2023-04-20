import { Dialog, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelService from "../../services/channel.service";
import { translationKeys } from "./constants";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { ToastType } from "../../context/toast";

interface Props {
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | undefined;
  channelSocket: ChannelSocket;
}

export default function GetIdDialog(props: Props) {
  const { open, toggleOpen, channel, channelSocket } = props;
  const { t } = useTranslation();
  const toast = useContext(TranscendanceContext);

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
      ChannelService.getUserByName(input)
        .then((resolve) => {
          if (resolve.data)
            channelSocket.inviteToChannel(channel, resolve.data.id);
          else {
            toast.dispatchTranscendanceState({
              type: TranscendanceStateActionType.TOGGLE_TOAST,
              toast: {
                type: ToastType.ERROR,
                title: t(translationKeys.invite.failed) as string,
                message: t(
                  translationKeys.invite.notFound
                ) as string,
              },
            });
          }
        })
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 3 }}
    >
      <TextField
        label={t(translationKeys.invite.userName)}
        value={input}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      ></TextField>
    </Dialog>
  );
}
