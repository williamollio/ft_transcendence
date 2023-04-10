import { Menu, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { GameSocket } from "../../classes/GameSocket.class";
import { ToastType } from "../../context/toast";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import {
  GameMode,
  ChannelInfoContextMenu,
} from "../../interfaces/chat.interface";
import ChannelService from "../../services/channel.service";
import { translationKeys } from "./constants";
import { useNavigate } from "react-router-dom";

interface Props {
  blockedUser: Array<string>;
  refetchBlockedUsers: any;
  contextMenu: ChannelInfoContextMenu | null;
  setContextMenu: Dispatch<SetStateAction<ChannelInfoContextMenu | null>>;
  channelSocket: ChannelSocket;
  gameSocket: GameSocket;
}

export default function UserContext(props: Props) {
  const {
    blockedUser,
    refetchBlockedUsers,
    contextMenu,
    setContextMenu,
    channelSocket,
    gameSocket,
  } = props;
  const { t } = useTranslation();
  const toast = useContext(TranscendanceContext);
  const navigate = useNavigate();

  const [blockStatus, setBlockStatus] = useState<"Block" | "Unblock">("Block");
  const [self, setSelf] = useState<boolean>(false);
  const [gameModeSelect, setGameModeSelect] = useState<GameMode>(
    GameMode.CLASSIC
  );

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
    handleContextClose();
    if (contextMenu && contextMenu.user) {
      channelSocket.createDm(contextMenu.user);
    }
  };

  const handleProfile = () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      navigate(`/profile/${contextMenu.user.id}`, {
        state: { userId: contextMenu.user.id },
      });
    }
  };

  const handleInviteGame = (_event: React.MouseEvent<HTMLLIElement>) => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      gameSocket.inviteToGame(gameModeSelect, contextMenu.user.id);
    }
  };

  const handleBlock = async () => {
    handleContextClose();
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      if (blockStatus === "Block") {
        let ret = await ChannelService.blockUser(contextMenu.user.id);
        if (typeof ret === "string") {
          toast.dispatchTranscendanceState({
            type: TranscendanceStateActionType.TOGGLE_TOAST,
            toast: {
              type: ToastType.ERROR,
              title: ret,
              message: t(translationKeys.errorMessages.unblockFail) as string,
            },
          });
        } else refetchBlockedUsers();
        refetchBlockedUsers();
      } else if (blockStatus === "Unblock") {
        let ret = await ChannelService.unblockUser(contextMenu.user.id);
        if (typeof ret === "string") {
          toast.dispatchTranscendanceState({
            type: TranscendanceStateActionType.TOGGLE_TOAST,
            toast: {
              type: ToastType.ERROR,
              title: ret,
              message: t(translationKeys.errorMessages.unblockFail) as string,
            },
          });
        } else refetchBlockedUsers();
      }
    }
  };

  const handleMute = () => {
    handleContextClose();
    if (
      contextMenu &&
      contextMenu.channelId &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      channelSocket.muteUser(contextMenu.channelId, contextMenu.user.id);
    }
  };

  const handleKick = () => {
    handleContextClose();
    if (
      contextMenu &&
      contextMenu.channelId &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      channelSocket.banUser(contextMenu.channelId, contextMenu.user.id);
    }
  };

  const handlePromote = () => {
    handleContextClose();
    if (
      contextMenu &&
      contextMenu.channelId &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      channelSocket.editRole(contextMenu.channelId, contextMenu.user.id);
    }
  };

  const handleGameModeChange = (event: SelectChangeEvent) => {
    setGameModeSelect(event.target.value as GameMode);
  };

  return (
    <>
      <Menu
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
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
          {t(translationKeys.buttons.whisper)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handlePromote}>
          {t(translationKeys.buttons.promote)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleProfile}>
          {t(translationKeys.buttons.viewProfile)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleInviteGame}>
          {t(translationKeys.buttons.inviteToGame)}
        </MenuItem>
        <Select
          sx={{ width: "100%" }}
          size="small"
          onChange={handleGameModeChange}
          placeholder={t(translationKeys.buttons.gameMode) as string}
          value={gameModeSelect}
        >
          <MenuItem value={GameMode.CLASSIC}>
            {t(translationKeys.invite.classic)}
          </MenuItem>
          <MenuItem value={GameMode.MAYHEM}>
            {t(translationKeys.invite.mayhem)}
          </MenuItem>
        </Select>
        <MenuItem disabled={self} onClick={handleBlock}>
          {blockStatus === "Block"
            ? t(translationKeys.buttons.block)
            : t(translationKeys.buttons.unblock)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleMute}>
          {t(translationKeys.buttons.mute)}
        </MenuItem>
        <MenuItem disabled={self} onClick={handleKick}>
          {t(translationKeys.buttons.ban)}
        </MenuItem>
      </Menu>
    </>
  );
}
