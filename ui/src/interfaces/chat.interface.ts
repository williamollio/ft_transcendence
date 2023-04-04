import { accessTypes, chatRoom } from "../classes/chatRoom.class";

export interface messagesDto {
  userId: string;
  userName: string;
  content: string;
  channelId: string;
}

export interface user {
  name: string;
  id: string;
}

export interface channelUser {
  id: string;
  name: string;
  status: "OFFLINE" | "ONLINE" | "PLAYING";
  role?: "USER" | "ADMIN" | "OWNER";
}

export interface CRDialogValue {
  key: string;
  access: accessTypes;
  password: string;
}

export interface JoinDialogValue {
  name: string;
  password: string;
}

export interface DBChannelElement {
  id: string;
  name: string;
  type: accessTypes;
  users: channelUser[];
  messages: Array<messagesDto>;
}

export interface DBChannelUserListElement {
  id: string;
  users: Array<any>;
}

export interface ChannelInfoContextMenu {
  mouseX: number;
  mouseY: number;
  user: user;
  channelId: string;
}

export enum GameMode {
  CLASSIC = "CLASSIC",
  MAYHEM = "MAYHEM",
}

export const failEvents = [
  "inviteFailed",
  "joinRoomError",
  "joinRoomFailed",
  "leaveRoomFailed",
  "createRoomFailed",
  "editRoomFailed",
  "banFailed",
  "muteFailed",
  "updateRoleFailed",
  "messageRoomFailed",
];

export interface ContextMenu {
  mouseX: number;
  mouseY: number;
  channel: chatRoom;
}

export interface RoomInvite {
  id: string;
  name: string;
  type: accessTypes;
}
