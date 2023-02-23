import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelInfoDialog from "./ChannelInfoDialog";
import GetIdDialog from "./GetIdDialog";

export default function RoomContextMenu({
  contextMenu,
  setContextMenu,
  channels,
  setCurrentRoom,
  setMessages,
  channelSocket,
  setAlertMsg,
  toggleAlert,
}: {
  contextMenu: { mouseX: number; mouseY: number; channel: chatRoom } | null;
  setContextMenu: any;
  channels: chatRoom[];
  setCurrentRoom: any;
  setMessages: any;
  channelSocket: ChannelSocket;
  setAlertMsg: any;
  toggleAlert: any;
}) {
  const [channelInfoOpen, toggleChannelInfo] = useState(false);

  const [openId, toggleOpenId] = useState<boolean>(false);

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const removeRoom = () => {
    toggleAlert(false);
    if (contextMenu && contextMenu.channel) {
      let index = channels.findIndex(
        (element: chatRoom) => element === contextMenu.channel
      );
      if (index >= 0) {
        if (channelSocket.deleteRoom(contextMenu.channel) === false) {
          setCurrentRoom(channels[index - 1] ? channels[index - 1] : false);
          setMessages(
            channels[index - 1] ? channels[index - 1].messages : false
          );
        } else setAlertMsg("Failed to remove channel");
        toggleAlert(true);
        return;
      }
    }
    handleContextClose();
  };

  const handleChannelInfoOpen = () => {
    toggleAlert(false);
    toggleChannelInfo(true);
  };

  const handleInvite = () => {
    toggleAlert(false);
    toggleOpenId(true);
  };

  return (
    <>
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
        <MenuItem onClick={handleInvite}>Invite</MenuItem>
        <ChannelInfoDialog
          contextMenuClose={handleContextClose}
          channelInfoOpen={channelInfoOpen}
          toggleChannelInfo={toggleChannelInfo}
          channel={contextMenu ? contextMenu.channel : null}
          channelSocket={channelSocket}
        ></ChannelInfoDialog>
        <GetIdDialog
          channelSocket={channelSocket}
          open={openId}
          toggleOpen={toggleOpenId}
          channel={contextMenu ? contextMenu.channel : null}
        ></GetIdDialog>
      </Menu>
    </>
  );
}
