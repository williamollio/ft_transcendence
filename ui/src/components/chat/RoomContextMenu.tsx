import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelInfoDialog from "./ChannelInfoDialog";

export default function RoomContextMenu({
  contextMenu,
  setContextMenu,
  channels,
  setCurrentRoom,
  setMessages,
}: {
  contextMenu: { mouseX: number; mouseY: number; channel: chatRoom } | null;
  setContextMenu: any;
  channels: chatRoom[];
  setCurrentRoom: any;
  setMessages: any;
}) {
  const [channelInfoOpen, toggleChannelInfo] = useState(false);

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const removeRoom = () => {
    if (contextMenu && contextMenu.channel) {
      let index = channels.findIndex(
        (element: chatRoom) => element === contextMenu.channel
      );
      if (index >= 0) {
        channels.splice(index, 1);
        setCurrentRoom(channels[index - 1] ? channels[index - 1] : false);
        setMessages(channels[index - 1] ? channels[index - 1].messages : false);
      }
    }
    handleContextClose();
  };

  const handleChannelInfoOpen = () => {
    toggleChannelInfo(true);
  };

  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleContextClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={removeRoom}>Remove</MenuItem>
      <MenuItem onClick={handleChannelInfoOpen}>Channel Info</MenuItem>
      <ChannelInfoDialog
        contextMenuClose={handleContextClose}
        channelInfoOpen={channelInfoOpen}
        toggleChannelInfo={toggleChannelInfo}
        channel={contextMenu ? contextMenu.channel : null}
      ></ChannelInfoDialog>
    </Menu>
  );
}
