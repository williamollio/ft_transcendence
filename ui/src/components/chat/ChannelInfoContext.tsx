import { Menu, MenuItem } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { channelUser } from "../../interfaces/chat.interfaces";
import ChannelService from "../../services/channel.service";

export default function ChannelInfoContext({
  blockedUser,
  refetchBlockedUsers,
  setAlertMsg,
  channel,
  contextMenu,
  setContextMenu,
  channelSocket,
}: {
  blockedUser: Array<string>;
  refetchBlockedUsers: any;
  setAlertMsg: Dispatch<SetStateAction<string>>;
  channel: chatRoom | undefined;
  contextMenu: {
    mouseX: number;
    mouseY: number;
    user: channelUser;
  } | null;
  setContextMenu: any;
  channelSocket: ChannelSocket;
}) {
  //   const [openTime, toggleOpenTime] = useState<boolean>(false);
  //   const [action, setAction] = useState<"kick" | "mute">("kick");
  const [blockStatus, setBlockStatus] = useState<"Block" | "Unblock">("Block");
  const [self, setSelf] = useState<boolean>(false);

  useEffect(() => {
    if (contextMenu) {
      if (contextMenu.user.id === channelSocket.user.id) {
        setSelf(true);
        setBlockStatus("Block");
      } else {
        setSelf(false);
        if (blockedUser) {
          if (blockedUser.some((element) => element === contextMenu.user.id)) {
            setBlockStatus("Unblock");
          } else {
            setBlockStatus("Block");
          }
        }
      }
    }
  }, [contextMenu]);

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const handleDM = () => {
    setAlertMsg("Failed to set up directmessaging");
    handleContextClose();
    if (contextMenu && contextMenu.user) {
      channelSocket.createDm(contextMenu.user);
    }
  };

  const handleProfile = () => {
    setAlertMsg("Failed to access profile");
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      // checkout profile with user.id
    }
  };

  const handleInviteGame = () => {
    setAlertMsg("Failed to invite to play");
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      // setupGame with user.id
    }
  };

  const handleBlock = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      if (blockStatus === "Block") {
        setAlertMsg("Failed to block User");
        ChannelService.blockUser(contextMenu.user.id).then((resolve) => {
          console.log(resolve.data);
		  refetchBlockedUsers();
        });
      } else if (blockStatus === "Unblock") {
        setAlertMsg("Failed to unblock User");
        ChannelService.unblockUser(contextMenu.user.id).then((resolve) => {
          console.log(resolve.data);
		  refetchBlockedUsers();
        });
      }
    }
  };

  const handleMute = () => {
    setAlertMsg("Failed to mute user");
    handleContextClose();
    if (
      channel &&
      channel.id &&
      contextMenu &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      //   setAction("mute");
      channelSocket.muteUser(channel.id, contextMenu.user.id);
    }
  };

  const handleKick = () => {
    setAlertMsg("Failed to ban user");
    handleContextClose();
    if (
      channel &&
      channel.id &&
      contextMenu &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      //   setAction("kick");
      channelSocket.banUser(channel.id, contextMenu.user.id);
    }
  };

  const handlePromote = () => {
    handleContextClose();
    setAlertMsg("Failed to promote user");
    if (
      channel &&
      channel.id &&
      contextMenu &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      channelSocket.editRole(channel.id, contextMenu.user.id);
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
        <MenuItem disabled={self} onClick={handleDM}>
          Whisper
        </MenuItem>
        <MenuItem disabled={self} onClick={handlePromote}>
          Promote
        </MenuItem>
        <MenuItem disabled={self} onClick={handleProfile}>
          View Profile
        </MenuItem>
        <MenuItem disabled={self} onClick={handleInviteGame}>
          Invite to Game
        </MenuItem>
        <MenuItem disabled={self} onClick={handleBlock}>
          {blockStatus}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleMute}>
          Mute
        </MenuItem>
        <MenuItem disabled={self} onClick={handleKick}>
          Ban
        </MenuItem>
      </Menu>
      {/* <GetTimeDialog
        open={openTime}
        toggleOpen={toggleOpenTime}
        user={contextMenu ? contextMenu.user : null}
        action={action}
      ></GetTimeDialog> */}
    </>
  );
}
