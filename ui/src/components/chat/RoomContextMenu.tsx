import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { UserSocket } from "../../classes/UserSocket.class";
import ChannelInfoDialog from "./ChannelInfoDialog";
import GetIdDialog from "./GetIdDialog";

export default function RoomContextMenu({
  userSocket,
  setNewChannel,
  contextMenu,
  setContextMenu,
  channelSocket,
  setAlertMsg,
  toggleAlert,
}: {
  userSocket: UserSocket;
  setNewChannel: any;
  contextMenu: { mouseX: number; mouseY: number; channel: chatRoom } | null;
  setContextMenu: any;
  channelSocket: ChannelSocket;
  setAlertMsg: any;
  toggleAlert: any;
}) {
  const [channelInfoOpen, toggleChannelInfo] = useState(false);

  const [contextChannel, setContextChannel] = useState<chatRoom | undefined>(
    undefined
  );

  const [openId, toggleOpenId] = useState<boolean>(false);

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const removeRoom = () => {
    toggleAlert(false);
    setAlertMsg("Failed to remove channel");
    if (contextMenu) {
      let index = channelSocket.channels.findIndex(
        (element: chatRoom) => element === contextMenu.channel
      );
      if (index >= 0) {
        channelSocket.deleteRoom(contextMenu.channel);
      }
    } else toggleAlert(true);
    handleContextClose();
  };

  const handleChannelInfoOpen = () => {
    if (contextMenu) {
      setContextChannel(contextMenu.channel);
      toggleAlert(false);
      toggleChannelInfo(true);
      handleContextClose();
    }
  };

  const handleInvite = () => {
    if (contextMenu) {
      setContextChannel(contextMenu.channel);
      toggleAlert(false);
      toggleOpenId(true);
      handleContextClose();
    }
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
        userSocket={userSocket}
        toggleError={toggleAlert}
        setAlertMsg={setAlertMsg}
        setNewChannel={setNewChannel}
        channelInfoOpen={channelInfoOpen}
        toggleChannelInfo={toggleChannelInfo}
        channel={contextChannel}
        channelSocket={channelSocket}
      ></ChannelInfoDialog>
      <GetIdDialog
        toggleError={toggleAlert}
        channelSocket={channelSocket}
        open={openId}
        toggleOpen={toggleOpenId}
        channel={contextChannel}
      ></GetIdDialog>
    </>
  );
}
