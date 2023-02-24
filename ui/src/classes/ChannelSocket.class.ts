import { Socket } from "socket.io-client";
import { initSocket } from "../services/initSocket.service";
import { accessTypes, chatRoom } from "./chatRoom.class";
import { messagesDto, user } from "../interfaces/chat.interfaces";
import { getTokenData, Cookie } from "../utils/auth-helper";
import ChannelService from "../services/channel.service";
import { channel } from "diagnostics_channel";
import { ThermostatOutlined } from "@mui/icons-material";

export class ChannelSocket {
  socket: Socket;
  user: user;
  channels: chatRoom[];

  constructor() {
    let token = localStorage.getItem(Cookie.TOKEN);
    this.socket = initSocket("http://localhost:3333");
    token
      ? (this.user = getTokenData(token))
      : (this.user = { id: "", name: "" });
    this.channels = new Array<chatRoom>();
    if (!this.user.name) this.user.name = "missing";
  }

  createRoom = (
    channelObj: chatRoom,
    setNewChannel: any,
    password?: string
  ) => {
    this.socket.emit("createRoom", {
      channelInfo: { channelObj, passwordHash: password },
    });
    this.socket.once("roomCreated", (channelId) => {
      setNewChannel(
        this.channels[
          this.channels.push(
            new chatRoom(channelId, channelObj.key, channelObj.access)
          ) - 1
        ]
      );
      this.socket.removeAllListeners("createRoomFailed");
      return false;
    });
    this.socket.once("createRoomFailed", () => {
      this.socket.removeAllListeners("roomCreated");
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

  joinRoom = (channelId: string, access: accessTypes, password?: string) => {
    console.log("emitting joinRoom");
    this.socket.emit("joinRoom", {
      joinInfo: {
        id: channelId,
        type: access,
        passwordHash: password,
      },
    });
    this.socket.once(
      "roomJoined",
      async (userId: string, channelId: string) => {
        if (userId === this.user.id) {
          await ChannelService.getChannel(channelId).then((value) => {
            this.channels.push(
              new chatRoom(channelId, value.data.name, value.data.type)
            );
          });
        }
        this.socket.removeAllListeners("joinRoomError");
        this.socket.removeAllListeners("joinRoomFailed");
        return false;
      }
    );
    ["joinRoomError", "joinRoomFailed"].forEach((element) => {
      this.socket.on(element, () => {
        this.socket.removeAllListeners("roomJoined");
        this.socket.removeAllListeners("joinRoomError");
        this.socket.removeAllListeners("joinRoomFailed");
        return true;
      });
    });
  };

  messageRoom = (message: messagesDto) => {
    console.log("emitting message");
    console.log(message);
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
        name: newName,
        type: type,
        passwordHash: newPassword,
        currentPasswordHash: password,
      },
    });
    this.socket.on("roomEdited", async (newChannelId: string) => {
      let index = this.channels.findIndex(
        (element) => element.id === channel.id
      );
	  await ChannelService.getChannel(newChannelId).then((value) => {
		  this.channels[index].key = value.data.name;
		  this.channels[index].access = value.data.type;
	  });
      if (index >= 0) {
		  this.channels[index].id = newChannelId;
		  return false;
		} else return true;
    });
    this.socket.on("editRoomFailed", () => {
		console.log("failed");
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

  inviteToChannel = (
    channel: chatRoom | null,
    otherUserId: string
  ): boolean => {
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
