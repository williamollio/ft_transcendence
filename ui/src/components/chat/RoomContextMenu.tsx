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
  blockedUser: Array<string>;
  refetchBlockedUsers: any;
  userSocket: UserSocket;
  setNewChannel: any;
  contextMenu: { mouseX: number; mouseY: number; channel: chatRoom } | null;
  setContextMenu: any;
  channelSocket: ChannelSocket;
  setAlertMsg: Dispatch<SetStateAction<string>>;
  toggleAlert: Dispatch<SetStateAction<boolean>>;
  gameSocket: GameSocket;
}

export default function RoomContextMenu(props: Props) {
  const {
    blockedUser,
    refetchBlockedUsers,
    userSocket,
    setNewChannel,
    contextMenu,
    setContextMenu,
    channelSocket,
    setAlertMsg,
    toggleAlert,
    gameSocket,
  } = props;
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
    toggleAlert(false);
    setAlertMsg(t(translationKeys.removeRoomFail) as string);
    if (contextMenu) {
      let index = channelSocket.channels.findIndex(
        (element: chatRoom) => element.id === contextMenu.channel.id
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
        <MenuItem onClick={removeRoom}>{t(translationKeys.remove)}</MenuItem>
        <MenuItem onClick={handleChannelInfoOpen}>
          {t(translationKeys.channelInfo)}
        </MenuItem>
        <MenuItem onClick={handleInvite}>{t(translationKeys.invite)}</MenuItem>
      </Menu>
      <ChannelInfoDialog
        blockedUser={blockedUser}
        refetchBlockedUsers={refetchBlockedUsers}
        userSocket={userSocket}
        toggleError={toggleAlert}
        setAlertMsg={setAlertMsg}
        setNewChannel={setNewChannel}
        channelInfoOpen={channelInfoOpen}
        toggleChannelInfo={toggleChannelInfo}
        channel={contextChannel}
        channelSocket={channelSocket}
        gameSocket={gameSocket}
      ></ChannelInfoDialog>
      <GetIdDialog
        setAlertMsg={setAlertMsg}
        channelSocket={channelSocket}
        open={openId}
        toggleOpen={toggleOpenId}
        channel={contextChannel}
      ></GetIdDialog>
    </>
  );
}
