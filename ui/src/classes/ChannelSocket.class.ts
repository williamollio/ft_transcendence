import { Socket } from "socket.io-client";
import { initSocket } from "../services/initSocket.service";
import { accessTypes, chatRoom } from "./chatRoom.class";
import { channelUser, messagesDto, user } from "../interfaces/chat.interfaces";
import { getTokenData } from "../utils/auth-helper";
import UserService from "../services/users.service";
import ChannelService from "../services/channel.service";

export class ChannelSocket {
  socket: Socket;
  user: user;
  channels: Array<chatRoom>;
  error: any;

  constructor() {
    this.socket = initSocket("http://localhost:3333", null);
    this.user = { id: "", name: "" };
    this.error = false;
    this.channels = new Array<chatRoom>();
  }

  initializeSocket(token: string | null) {
    this.socket = initSocket("http://localhost:3333", token);
    token
      ? (this.user = getTokenData(token))
      : (this.user = { id: "", name: "" });
    if (this.user.id)
      UserService.getUser(this.user.id).then((resolve) => {
        this.user.name = resolve.data.name;
      });
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
      messageInfo: { channelId: message.room, content: message.message },
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
        // currentPasswordHash: password,
      },
    });
  };

  createDm = (otherUser: channelUser) => {
    this.socket.emit("createRoom", {
      createInfo: {
        name: otherUser.name,
        type: "DIRECTMESSAGE",
        userId: otherUser.id,
      },
    });
  };

  inviteToChannel = (channel: chatRoom | undefined, otherUserId: string) => {
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

  registerListener = (event: string, call: (...args: any) => void) => {
    this.socket.on(event, call);
  };

  removeListener = (event: string, call?: (...args: any) => void) => {
    this.socket.off(event, call);
  };
}
