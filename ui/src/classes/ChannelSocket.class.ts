import { Socket } from "socket.io-client";
import { initSocket } from "../services/initSocket.service";
import { accessTypes, chatRoom } from "./chatRoom.class";
import { channelUser, messagesDto, user } from "../interfaces/chat.interfaces";
import { getTokenData } from "../utils/auth-helper";

export class ChannelSocket {
  socket: Socket;
  user: user;
  channels: Array<chatRoom>;
  error: any;

  constructor() {
    this.socket = initSocket("http://localhost:3333", null);
    this.user = { id: "", name: "" };
    this.channels = new Array<chatRoom>();
    this.error = false;
  }

  initializeSocket(token: string | null) {
    this.socket = initSocket("http://localhost:3333", token);
    token
      ? (this.user = getTokenData(token))
      : (this.user = { id: "", name: "" });
  }

  createRoom = (channelObj: chatRoom, toggleError: any, password?: string) => {
    this.socket.emit("createRoom", {
      createInfo: {
        name: channelObj.key,
        type: channelObj.access,
        userId: undefined,
        passwordHash: password,
      },
    });
    this.socket.on("roomCreated", () => {
      toggleError(false);
    });
    this.socket.on("createRoomFailed", (error: string) => {
      console.log(error);
      toggleError(true);
    });
  };

  deleteRoom = (channel: chatRoom, toggleError: any) => {
    this.socket.emit("leaveRoom", {
      leaveInfo: { id: channel.id, type: channel.access },
    });
    this.socket.on("roomLeft", () => {
      toggleError(false);
    });
    this.socket.on("leaveRoomFailed", (error: string) => {
      console.log(error);
      toggleError(true);
    });
  };

  joinRoom = (
    channelId: string,
    access: accessTypes,
    toggleError: any,
    password?: string
  ) => {
    this.socket.emit("joinRoom", {
      joinInfo: {
        id: channelId,
        type: access,
        passwordHash: password,
      },
    });
    this.socket.on("roomJoined", () => {
      toggleError(false);
    });
    ["joinRoomError", "joinRoomFailed"].forEach((element) => {
      this.socket.on(element, () => {
        toggleError(true);
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
    toggleError: any,
    type?: accessTypes,
    password?: string,
    newPassword?: string,
    newName?: string
  ) => {
    this.socket.emit("editRoom", {
      channelId: channel.id,
      editInfo: {
        name: newName,
        type: type,
        passwordHash: newPassword,
        currentPasswordHash: password,
      },
    });
    this.socket.on("roomEdited", () => {
      toggleError(false);
    });
    this.socket.on("editRoomFailed", () => {
      toggleError(true);
    });
  };

  createDm = (otherUser: channelUser, toggleError: any) => {
    this.socket.emit("createRoom", {
      createInfo: {
        name: otherUser.name,
        type: "DIRECTMESSAGE",
        userId: otherUser.id,
      },
    });
    this.socket.on("roomCreated", () => {
      toggleError(false);
    });
    this.socket.on("createRoomFailed", () => {
      toggleError(true);
    });
  };

  inviteToChannel = (
    channel: chatRoom | null,
    otherUserId: string,
    toggleError: any
  ) => {
    if (channel) {
      this.socket.emit("inviteToChannel", {
        inviteInfo: {
          channelId: channel.id,
          invitedId: otherUserId,
          type: channel.access,
        },
      });
      this.socket.on("inviteFailed", () => {
        toggleError(true);
      });
      this.socket.on("inviteSucceeded", () => {
        toggleError(false);
      });
    }
  };

  banUser = (channelId: String, otherUserId: string, toggleError: any) => {
    this.socket.emit("banUser", {
      banInfo: {
        channelActionTargetId: otherUserId,
        channelActionOnChannelId: channelId,
        type: "BAN",
      },
    });
    this.socket.on("banSucceeded", () => {
      toggleError(false);
    });
    this.socket.on("banFailed", () => {
      toggleError(true);
    });
  };

  muteUser = (channelId: String, otherUserId: string, toggleError: any) => {
    this.socket.emit("muteUser", {
      banInfo: {
        channelActionTargetId: otherUserId,
        channelActionOnChannelId: channelId,
        type: "MUTE",
      },
    });
    this.socket.on("muteSucceeded", () => {
      toggleError(false);
    });
    this.socket.on("muteFailed", () => {
      toggleError(true);
    });
  };

  editRole = (channelId: string, userId: string, toggleError: any) => {
    this.socket.emit("updateRole", {
      channelId: channelId,
      targetInfo: { promotedUserId: userId },
    });
    this.socket.on("roleUpdated", () => {
      toggleError(false);
    });
    this.socket.on("updateRoleFailed", () => {
      toggleError(true);
    });
  };
}
