import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BigSocket } from "../../classes/BigSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { translationKeys } from "./constants";
import ChannelInfoDialog from "./ChannelInfoDialog";
import GetIdDialog from "./GetIdDialog";

interface Props {
  contextMenu: { mouseX: number; mouseY: number; channel: chatRoom } | null;
  setContextMenu: any;
  bigSocket: BigSocket;
}

export default function RoomContextMenu(props: Props) {
  const { contextMenu, setContextMenu, bigSocket } = props;
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
      let index = bigSocket.channels.findIndex(
        (element: chatRoom) => element.id === contextMenu.channel.id
      );
      if (index >= 0) {
        bigSocket.deleteRoom(contextMenu.channel);
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
        sx={{ zIndex: (theme) => theme.zIndex.modal + 3 }}
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
        bigSocket={bigSocket}
      ></ChannelInfoDialog>
      <GetIdDialog
        bigSocket={bigSocket}
        open={openId}
        toggleOpen={toggleOpenId}
        channel={contextChannel}
      ></GetIdDialog>
    </>
  );
}
