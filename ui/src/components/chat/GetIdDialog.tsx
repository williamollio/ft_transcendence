import { Dialog, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelService from "../../services/channel.service";
import { translationKeys } from "./constants";

interface Props {
  setAlertMsg: Dispatch<SetStateAction<string>>;
  open: boolean;
  toggleOpen: any;
  channel: chatRoom | undefined;
  channelSocket: ChannelSocket;
}

export default function GetIdDialog(props: Props) {
  const { setAlertMsg, open, toggleOpen, channel, channelSocket } = props;
  const { t } = useTranslation();

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
      setAlertMsg(t(translationKeys.inviteFailed) as string);
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
        label={t(translationKeys.userName)}
        value={input}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      ></TextField>
    </Dialog>
  );
}
