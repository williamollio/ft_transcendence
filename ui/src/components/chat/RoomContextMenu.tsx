import { Menu, MenuItem } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { GameSocket } from "../../classes/GameSocket.class";
import { UserSocket } from "../../classes/UserSocket.class";
import { translationKeys } from "./constants";
import ChannelInfoDialog from "./ChannelInfoDialog";
import GetIdDialog from "./GetIdDialog";

interface Props {
  contextMenu: { mouseX: number; mouseY: number; channel: chatRoom } | null;
  setContextMenu: any;
  channelSocket: ChannelSocket;
}

export default function RoomContextMenu(props: Props) {
  const { contextMenu, setContextMenu, channelSocket } = props;
  const { t } = useTranslation();

  const [channelInfoOpen, toggleChannelInfo] = useState(false);
  const [contextChannel, setContextChannel] = useState<chatRoom | undefined>(
    undefined
  );
  const [openId, toggleOpenId] = useState<boolean>(false);
  const handleContextClose = () => {
    setContextMenu(null);
  };

  const removeRoom = () => {
    if (contextMenu) {
      let index = channelSocket.channels.findIndex(
        (element: chatRoom) => element.id === contextMenu.channel.id
      );
      if (index >= 0) {
        channelSocket.deleteRoom(contextMenu.channel);
      }
    }
    handleContextClose();
  };

  const handleChannelInfoOpen = () => {
    if (contextMenu) {
      setContextChannel(contextMenu.channel);
      toggleChannelInfo(true);
      handleContextClose();
    }
  };

  const handleInvite = () => {
    if (contextMenu) {
      setContextChannel(contextMenu.channel);
      toggleOpenId(true);
      handleContextClose();
    }
  };

  return (
    <>
      <Menu
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
        open={contextMenu !== null}
        onClose={handleContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={removeRoom}>
          {t(translationKeys.roomContext.remove)}
        </MenuItem>
        <MenuItem onClick={handleChannelInfoOpen}>
          {t(translationKeys.roomContext.channelInfo)}
        </MenuItem>
        <MenuItem onClick={handleInvite}>
          {t(translationKeys.roomContext.invite)}
        </MenuItem>
      </Menu>
      <ChannelInfoDialog
        channelInfoOpen={channelInfoOpen}
        toggleChannelInfo={toggleChannelInfo}
        channel={contextChannel}
        channelSocket={channelSocket}
      ></ChannelInfoDialog>
      <GetIdDialog
        channelSocket={channelSocket}
        open={openId}
        toggleOpen={toggleOpenId}
        channel={contextChannel}
      ></GetIdDialog>
    </>
  );
}
