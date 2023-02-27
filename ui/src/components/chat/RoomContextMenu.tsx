import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import ChannelInfoDialog from "./ChannelInfoDialog";
import GetIdDialog from "./GetIdDialog";

export default function RoomContextMenu({
  toggleError,
  setNewChannel,
  contextMenu,
  setContextMenu,
  channelSocket,
  setAlertMsg,
  toggleAlert,
}: {
  toggleError: any;
  setNewChannel: any;
  contextMenu: { mouseX: number; mouseY: number; channel: chatRoom } | null;
  setContextMenu: any;
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
    setAlertMsg("Failed to remove channel");
    if (contextMenu?.channel) {
      let index = channelSocket.channels.findIndex(
        (element: chatRoom) => element === contextMenu?.channel
      );
      if (index >= 0) {
        channelSocket.deleteRoom(contextMenu?.channel, toggleError);
        toggleAlert(true);
      }
    }
    handleContextClose();
  };

  const handleChannelInfoOpen = () => {
    toggleAlert(false);
    toggleChannelInfo(true);
    handleContextClose();
  };

  const handleInvite = () => {
    toggleAlert(false);
    toggleOpenId(true);
    handleContextClose();
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
      </Menu>
      <ChannelInfoDialog
        toggleError={toggleError}
		setAlertMsg={setAlertMsg}
        setNewChannel={setNewChannel}
        channelInfoOpen={channelInfoOpen}
        toggleChannelInfo={toggleChannelInfo}
        channel={contextMenu?.channel ? contextMenu?.channel : null}
        channelSocket={channelSocket}
      ></ChannelInfoDialog>
      <GetIdDialog
        toggleError={toggleError}
        channelSocket={channelSocket}
        open={openId}
        toggleOpen={toggleOpenId}
        channel={contextMenu?.channel ? contextMenu?.channel : null}
      ></GetIdDialog>
    </>
  );
}
