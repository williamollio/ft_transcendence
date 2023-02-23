import { Socket } from "socket.io-client";
import { initSocket } from "../components/hook/initSocket";
import { accessTypes, chatRoom } from "./chatRoom.class";
import { messagesDto, user } from "../interfaces/chat.interfaces";

export class ChannelSocket {
  socket: Socket;
  user: user;
  channels: chatRoom[];

  constructor() {
    this.socket = initSocket("http://localhost:3333");
    this.user = { id: "user1", name: "william" };
    this.channels = new Array<chatRoom>();
  }

  createRoom = (
    channelObj: chatRoom,
    setNewChannel: any,
    password?: string
  ) => {
    this.socket.emit("createRoom", {
      channelInfo: { channelObj, passwordHash: password },
    });
    this.socket.on("roomCreated", (channelId) => {
      setNewChannel(
        this.channels[
          this.channels.push(
            new chatRoom(channelId, channelObj.key, channelObj.access)
          ) - 1
        ]
      );
      return false;
    });
    this.socket.on("createRoomFailed", () => {
      return true;
    });
  };

  deleteRoom = (channel: chatRoom): Boolean => {
    this.socket.emit("leaveRoom", {
      leaveInfo: { id: channel.id, type: channel.access },
    });
    this.socket.on(
      "roomLeft",
      (args: { userId: String; channelId: String }) => {
        if (channel.id === args.channelId && args.userId === this.user.id) {
          let index = this.channels.findIndex(
            (element: chatRoom) => element.id === args.channelId
          );
          if (index >= 0) {
            this.channels.splice(index, 1);
            return false;
          }
        }
      }
    );
    this.socket.on("leaveRoomFailed", () => {
      return true;
    });
    return false;
  };

  joinRoom = (channelObj: chatRoom, password: string) => {
    this.socket.emit("joinRoom", {
      joinInfo: {
        id: channelObj.id,
        type: channelObj.access,
        passwordHash: password,
      },
    });
    this.socket.on("roomJoined", (userId: string, channelId: string) => {
      if (userId === this.user.id)
        this.channels.push(
          new chatRoom(channelId, channelObj.key, channelObj.access)
        );
      return false;
    });
    ["joinRoomError", "joinRoomFailed"].forEach((element) => {
      this.socket.on(element, () => {
        return true;
      });
    });
  };

  messageRoom = (message: messagesDto) => {
    this.socket.emit("messageRoom", {
      messageInfo: { channelId: message.room, content: message.message },
    });
    this.socket.on("messageRoomFailed", () => {
      return true;
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
        name: newName,
        type: type,
        passwordHash: newPassword,
        currentPasswordHash: password,
      },
    });
    this.socket.on("roomEdited", (newChannelId: string) => {
      let index = this.channels.findIndex(
        (element) => element.id === channel.id
      );
      if (index >= 0) {
        this.channels[index].id = newChannelId;
        return false;
      } else return true;
    });
    this.socket.on("editRoomFailed", () => {
      return true;
    });
  };

  createDm = (otherUser: user) => {
    this.socket.emit("createRoom", {
      createInfo: {
        name: otherUser.name,
        type: "DIRECTMESSAGE",
        userId: otherUser.id,
      },
    });
    this.socket.on("roomCreated", ({ channelId, creatorId }) => {
      let index =
        this.channels.push(
          new chatRoom(channelId, otherUser.name, "DIRECTMESSAGE")
        ) - 1;
      this.channels[index].users.push(otherUser);
      this.channels[index].users.push(this.user);
      return false;
    });
    this.socket.on("createRoomFailed", () => {
      return true;
    });
  };

  inviteToChannel = (channel: chatRoom | null, otherUserId: string): boolean => {
    if (channel) {
      this.socket.emit("inviteToChannel", {
        inviteInfo: {
          channelId: channel.id,
          invitedId: otherUserId,
          type: channel.access,
        },
      });
      this.socket.on("inviteFailed", () => {
        return true;
      });
      this.socket.on("inviteSucceeded", () => {
        return false;
      });
    }
	return true;
  };

  banUser = (channelId: String, otherUserId: string, time: number) => {
    this.socket.emit("banUser", {
      banInfo: {
        channelActionTargetId: otherUserId,
        channelActionOnChannelId: channelId,
        type: "BAN",
        // time: time,
      },
    });
    this.socket.on("banSucceeded", () => {
      return false;
    });
    this.socket.on("banFailed", () => {
      return true;
    });
  };

  muteUser = (channelId: String, otherUserId: string, time: number) => {
    this.socket.emit("muteUser", {
      banInfo: {
        channelActionTargetId: otherUserId,
        channelActionOnChannelId: channelId,
        type: "MUTE",
        // time: time,
      },
    });
    this.socket.on("muteSucceeded", () => {
      return false;
    });
    this.socket.on("muteFailed", () => {
      return true;
    });
  };

  editRole = (channelId: string, userId: string) => {
    this.socket.emit("updateRole", {
      channelId: channelId,
      targetInfo: { promotedUserId: userId },
    });
    this.socket.on("roleUpdated", () => {
      return false;
    });
    this.socket.on("updateRoleFailed", () => {
      return true;
    });
  };
}
