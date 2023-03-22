import { Menu, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { chatRoom } from "../../classes/chatRoom.class";
import { GameSocket } from "../../classes/GameSocket.class";
import {
  GameMode,
  ChannelInfoContextMenu,
} from "../../interfaces/chat.interface";
import ChannelService from "../../services/channel.service";
import { translationKeys } from "./constants";

interface Props {
  blockedUser: Array<string>;
  refetchBlockedUsers: any;
  setAlertMsg: Dispatch<SetStateAction<string>>;
  channel: chatRoom | undefined;
  contextMenu: ChannelInfoContextMenu | null;
  setContextMenu: Dispatch<SetStateAction<ChannelInfoContextMenu | null>>;
  channelSocket: ChannelSocket;
  gameSocket: GameSocket;
}

export default function ChannelInfoContext(props: Props) {
  const {
    blockedUser,
    refetchBlockedUsers,
    setAlertMsg,
    channel,
    contextMenu,
    setContextMenu,
    channelSocket,
    gameSocket,
  } = props;
  const [blockStatus, setBlockStatus] = useState<"Block" | "Unblock">("Block");
  const [self, setSelf] = useState<boolean>(false);
  const [gameModeSelect, setGameModeSelect] = useState<string>(
    GameMode.CLASSIC
  );
  const { t } = useTranslation();

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

  const handleInviteGame = (_event: React.MouseEvent<HTMLLIElement>) => {
    setAlertMsg("Failed to invite to play");
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      gameSocket.inviteToGame(gameModeSelect, contextMenu.user.id);
    }
  };

  const handleBlock = async () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      if (blockStatus === "Block") {
        setAlertMsg("Failed to block User");
        await ChannelService.blockUser(contextMenu.user.id);
        refetchBlockedUsers();
      } else if (blockStatus === "Unblock") {
        setAlertMsg("Failed to unblock User");
        await ChannelService.unblockUser(contextMenu.user.id);
        refetchBlockedUsers();
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

  const handleGameModeChange = (event: SelectChangeEvent) => {
    setGameModeSelect(event.target.value);
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
          {t(translationKeys.whisper)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handlePromote}>
          {t(translationKeys.promote)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleProfile}>
          {t(translationKeys.viewProfile)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleInviteGame}>
          {t(translationKeys.inviteToGame)}
        </MenuItem>
        <Select
          sx={{ width: "100%" }}
          size="small"
          onChange={handleGameModeChange}
          placeholder={t(translationKeys.gameMode) as string}
          value={gameModeSelect}
        >
          <MenuItem value={GameMode.CLASSIC}>
            {t(translationKeys.classic)}
          </MenuItem>
          <MenuItem value={GameMode.MAYHEM}>
            {t(translationKeys.mayhem)}
          </MenuItem>
          <MenuItem value={GameMode.HOCKEY}>
            {t(translationKeys.hockey)}
          </MenuItem>
        </Select>
        <MenuItem disabled={self} onClick={handleBlock}>
          {blockStatus === "Block"
            ? t(translationKeys.block)
            : t(translationKeys.unblock)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleMute}>
          {t(translationKeys.mute)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleKick}>
          {t(translationKeys.ban)}
        </MenuItem>
      </Menu>
    </>
  );
}
