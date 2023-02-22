import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { user } from "../../interfaces/chat.interfaces";
import GetTimeDialog from "./GetTimeDialog";

export default function ChannelInfoContext({
  contextMenu,
  setContextMenu,
  channelSocket,
}: {
  contextMenu: {
    mouseX: number;
    mouseY: number;
    user: user;
  } | null;
  setContextMenu: any;
  channelSocket: ChannelSocket;
}) {
  const [openTime, toggleOpenTime] = useState<boolean>(false);
  const [action, setAction] = useState<"kick" | "mute">("kick");

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const handleDM = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user) {
      channelSocket.createDm(contextMenu.user);
    }
  };

  const handleProfile = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      // checkout profile with user.id
    }
  };

  const handleInviteGame = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      // setupGame with user.id
    }
  };

  const handleBlock = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
     
    }
  };

  const handleMute = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      setAction("mute");
      toggleOpenTime(true);
    }
  };

  const handleKick = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      setAction("kick");
      toggleOpenTime(true);
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
        <MenuItem onClick={handleDM}>Whisper</MenuItem>
        <MenuItem onClick={handleProfile}>View Profile</MenuItem>
        <MenuItem onClick={handleInviteGame}>Invite to Game</MenuItem>
        <MenuItem onClick={handleBlock}>Block</MenuItem>
        <MenuItem onClick={handleMute}>Mute</MenuItem>
        <MenuItem onClick={handleKick}>Kick</MenuItem>
      </Menu>
      <GetTimeDialog
        open={openTime}
        toggleOpen={toggleOpenTime}
        user={contextMenu ? contextMenu.user : null}
        action={action}
      ></GetTimeDialog>
    </>
  );
}
