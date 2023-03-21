import { accessTypes } from "../classes/chatRoom.class";

export interface messagesDto {
  message?: string | null;
  room?: string;
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

export interface DBChannelElement {
  id: string;
  name: string;
  type: accessTypes;
  users: channelUser[];
  messages: Array<{ content: string }>;
}

export interface DBChannelUserListElement {
  id: string;
  users: Array<any>;
}

export interface ChannelInfoContextMenu {
  mouseX: number;
  mouseY: number;
  user: channelUser;
}

export enum GameMode {
	CLASSIC = 'CLASSIC',
	MAYHEM = 'MAYHEM',
	HOCKEY = 'HOCKEY',
  }