import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { channelUser } from "../../interfaces/chat.interfaces";
import ChannelService from "../../services/channel.service";

export default function ChannelInfoContext({
  toggleError,
  channel,
  contextMenu,
  setContextMenu,
  channelSocket,
}: {
  toggleError: any;
  channel: chatRoom | null;
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
        ChannelService.getBlockedUsers().then((resolve) => {
          if (
            resolve.data.some((element) => {
              element.id === contextMenu.user.id;
            })
          ) {
            setBlockStatus("Unblock");
          } else {
            setBlockStatus("Block");
          }
        });
      }
    }
  }, [contextMenu]);

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const handleDM = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user) {
      channelSocket.createDm(contextMenu.user, toggleError);
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
      if (blockStatus === "Block") {
        ChannelService.blockUser(contextMenu.user.id).then((resolve) => {
          console.log(resolve.data);
        });
      } else if (blockStatus === "Unblock") {
        ChannelService.unblockUser(contextMenu.user.id).then((resolve) => {
          console.log(resolve.data);
        });
      }
    }
  };

  const handleMute = () => {
    handleContextClose();
    if (
      channel &&
      channel.id &&
      contextMenu &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      //   setAction("mute");
      channelSocket.banUser(channel.id, contextMenu.user.id, toggleError);
    }
  };

  const handleKick = () => {
    handleContextClose();
    if (
      channel &&
      channel.id &&
      contextMenu &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      //   setAction("kick");
      channelSocket.muteUser(channel.id, contextMenu.user.id, toggleError);
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
          Kick
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
