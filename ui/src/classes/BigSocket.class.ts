import { Socket } from "socket.io-client";
import { initSocket } from "../services/initSocket.service";
import { accessTypes, chatRoom } from "./chatRoom.class";
import { GameMode, messagesDto, user } from "../interfaces/chat.interface";
import { getTokenData } from "../utils/auth-helper";
import UserService from "../services/users.service";
import ChannelService from "../services/channel.service";

export class BigSocket {
  socket: Socket;
  user: user;
  channels: Array<chatRoom>;
  error: any;
  latestGame: "PLAY" | "WATCH" | null;
  spectatingPlayerId: string;

  constructor() {
    this.socket = initSocket(`http://${window.location.hostname}:3333`, null);
    this.latestGame = null;
    this.spectatingPlayerId = "";
    this.user = { id: "", name: "" };
    this.error = false;
    this.channels = new Array<chatRoom>();
  }

  PP = (newPosition: number) => {
    this.socket.volatile.emit("PP", newPosition + 50);
  };

  leave = () => {
    if (this.latestGame === "PLAY") this.leaveGame();
    else if (this.latestGame === "WATCH") this.leaveAsSpectator();
  };

  leaveGame = () => {
    this.socket.emit("leaveGame");
  };

  rejoin = () => {
    this.socket.emit("reJoin");
  };

  refuseInvite = (challengerId: string) => {
    this.socket.emit("refuseInvite", challengerId);
  };

  inviteToGame = (mode: GameMode, opponentId: string) => {
    this.socket.emit("createInvitationGame", {
      mode: mode,
      opponent: opponentId,
    });
  };

  joinGame = (mode: GameMode, inviteGameId?: string) => {
    this.socket.emit("joinGame", { mode: mode, inviteGameId: inviteGameId });
  };

  joinAsSpectator = (playerId: string) => {
    this.spectatingPlayerId = playerId;
    this.socket.emit("watchGame", { playerId: playerId });
  };

  leaveAsSpectator = () => {
    this.socket.emit("leaveWatch", { playerId: this.spectatingPlayerId });
    this.spectatingPlayerId = "";
  };

  initializeName(token: string | null) {
    if (token) {
      if (this.user.id === "") {
        this.user = getTokenData(token);
        UserService.getUser(this.user.id).then((resolve) => {
          this.user.name = resolve.data.name;
        });
      }
    }
  }

  connectToRoom = (channelId: string) => {
    this.socket.emit("connectToRoom", { channelId: channelId });
  };

  createRoom = (channelObj: chatRoom, password?: string) => {
    this.socket.emit("createRoom", {
      createInfo: {
        name: channelObj.key,
        type: channelObj.access,
        userId: undefined,
        passwordHash: password,
      },
    });
  };

  deleteRoom = (channel: chatRoom) => {
    this.socket.emit("leaveRoom", {
      leaveInfo: { id: channel.id, type: channel.access },
    });
  };

  joinRoom = (channelId: string, password?: string) => {
    ChannelService.fetchChannelData(channelId).then((resolve) => {
      this.socket.emit("joinRoom", {
        joinInfo: {
          id: channelId,
          type: resolve.type,
          passwordHash: password,
        },
      });
    });
  };

  messageRoom = (message: messagesDto) => {
    this.socket.emit("messageRoom", {
      messageInfo: message,
    });
  };

  editRoom = (
    channel: chatRoom,
    type?: accessTypes,
    password?: string,
    newPassword?: string,
    newName?: string
  ) => {
    this.socket.emit("editRoom", {
      channelId: channel.id,
      editInfo: {
        name: newName ? newName : channel.key,
        type: type,
        passwordHash: newPassword,
        currentPasswordHash: password,
      },
    });
  };

  createDm = (otherUser: { name: string; id: string }) => {
    this.socket.emit("createRoom", {
      createInfo: {
        name: otherUser.name,
        type: "DIRECTMESSAGE",
        userId: otherUser.id,
      },
    });
  };

  inviteToChannel = (
    channel: chatRoom | undefined,
    otherUserId: string | undefined
  ) => {
    if (channel) {
      this.socket.emit("inviteToChannel", {
        inviteInfo: {
          channelId: channel.id,
          invitedId: otherUserId,
          type: channel.access,
        },
      });
    }
  };

  banUser = (channelId: String, otherUserId: string) => {
    this.socket.emit("banUser", {
      banInfo: {
        channelActionTargetId: otherUserId,
        channelActionOnChannelId: channelId,
        type: "BAN",
      },
    });
  };

  muteUser = (channelId: String, otherUserId: string) => {
    this.socket.emit("muteUser", {
      muteInfo: {
        channelActionTargetId: otherUserId,
        channelActionOnChannelId: channelId,
        type: "MUTE",
      },
    });
  };

  editRole = (channelId: string, userId: string) => {
    this.socket.emit("updateRole", {
      channelId: channelId,
      targetInfo: { promotedUserId: userId },
    });
  };

  logIn = () => {
    this.socket.emit("connectUser");
  };

  joinGameStatus = () => {
    this.socket.emit("joinGameStatus");
  };

  leaveGameStatus = () => {
    this.socket.emit("leaveGameStatus");
  };

  status = (userIdFull: string[], listType: string) => {
    this.socket.emit("status", { requestedUsers: userIdFull, requestedList: listType });
  };

  logOut = () => {
    this.socket.disconnect();
  };
}
