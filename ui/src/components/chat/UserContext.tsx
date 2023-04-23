import {
  Grid,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Typography,
} from "@mui/material";
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
import classes from "../../styles.module.scss";
import { bgcolor } from "@mui/system";

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
  const [checked, toggleChecked] = useState<boolean>(false);

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
    if (contextMenu && contextMenu.user) {
      channelSocket.createDm(contextMenu.user);
    }
    handleContextClose();
  };

  const handleProfile = () => {
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      navigate(`/profile/${contextMenu.user.id}`, {
        state: { user: contextMenu.user.id },
      });
    }
    handleContextClose();
  };

  const handleInviteGame = (_event: React.MouseEvent<HTMLLIElement>) => {
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      gameSocket.inviteToGame(
        checked ? GameMode.MAYHEM : GameMode.CLASSIC,
        contextMenu.user.id
      );
    }
    handleContextClose();
  };

  const handleBlock = async () => {
    if (contextMenu && contextMenu.user && contextMenu.user.id) {
      if (blockStatus === "Block") {
        let ret = await ChannelService.blockUser(contextMenu.user.id);
        if (typeof ret === "string") {
          toast.dispatchTranscendanceState({
            type: TranscendanceStateActionType.TOGGLE_TOAST,
            toast: {
              type: ToastType.ERROR,
              title: ret,
              message: t(
                translationKeys.errorMessages.backendErrorMessage("blockFail")
              ) as string,
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
              message: t(
                translationKeys.errorMessages.backendErrorMessage("unblockFail")
              ) as string,
            },
          });
        } else refetchBlockedUsers();
      }
    }
    handleContextClose();
  };

  const handleMute = () => {
    if (
      contextMenu &&
      contextMenu.channelId &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      channelSocket.muteUser(contextMenu.channelId, contextMenu.user.id);
    }
    handleContextClose();
  };

  const handleKick = () => {
    if (
      contextMenu &&
      contextMenu.channelId &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      channelSocket.banUser(contextMenu.channelId, contextMenu.user.id);
    }
    handleContextClose();
  };

  const handlePromote = () => {
    if (
      contextMenu &&
      contextMenu.channelId &&
      contextMenu.user &&
      contextMenu.user.id
    ) {
      channelSocket.editRole(contextMenu.channelId, contextMenu.user.id);
    }
    handleContextClose();
  };

  return (
    <>
      <Menu
        PaperProps={{ sx: { bgcolor: classes.colorPrimary } }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 3,
        }}
        open={contextMenu !== null}
        onClose={handleContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          disabled={self}
          onClick={handleDM}
          sx={{ WebkitTextFillColor: "white" }}
        >
          {t(translationKeys.buttons.whisper)}
        </MenuItem>
        <MenuItem
          disabled={self}
          onClick={handlePromote}
          sx={{ WebkitTextFillColor: "white" }}
        >
          {t(translationKeys.buttons.promote)}
        </MenuItem>
        <MenuItem
          disabled={self}
          onClick={handleProfile}
          sx={{ WebkitTextFillColor: "white" }}
        >
          {t(translationKeys.buttons.viewProfile)}
        </MenuItem>
        <MenuItem
          disabled={self}
          onClick={handleInviteGame}
          sx={{ WebkitTextFillColor: "white" }}
        >
          {t(translationKeys.buttons.inviteToGame)}
        </MenuItem>
        <MenuItem disabled={self}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="row"
          >
            <Typography
              fontSize={12}
              color={checked ? "grey" : classes.colorAccent}
            >
              {t(translationKeys.invite.classic)}
            </Typography>
            <Switch
              checked={checked}
              onChange={() => toggleChecked(!checked)}
              color="default"
            ></Switch>
            <Typography
              fontSize={12}
              color={checked ? classes.colorAccent : "grey"}
            >
              {t(translationKeys.invite.mayhem)}
            </Typography>
          </Grid>
        </MenuItem>
        <MenuItem
          disabled={self}
          onClick={handleBlock}
          sx={{ WebkitTextFillColor: "white" }}
        >
          {blockStatus === "Block"
            ? t(translationKeys.buttons.block)
            : t(translationKeys.buttons.unblock)}
        </MenuItem>
        <MenuItem
          disabled={self}
          onClick={handleMute}
          sx={{ WebkitTextFillColor: "white" }}
        >
          {t(translationKeys.buttons.mute)}
        </MenuItem>
        <MenuItem
          disabled={self}
          onClick={handleKick}
          sx={{ WebkitTextFillColor: "white" }}
        >
          {t(translationKeys.buttons.ban)}
        </MenuItem>
      </Menu>
    </>
  );
}
