import { accessTypes } from "../classes/chatRoom.class";

export interface messagesDto {
  message?: string;
  room?: string;
}

export interface user {
  name: string;
  id: string;
}

export interface channelUser {
	id: string;
	name: string,
	status: "OFFLINE" | "ONLINE" | "PLAYING";
	role?: "USER" | "ADMIN" | "OWNER";
};

export interface CRDialogValue {
  key: string;
  access: accessTypes;
  password: string;
}

export interface DBChannelElement
{
	id: string,
	name: string,
	type: accessTypes,
}

export interface DBChannelUserListElement
{
	id: string,
	users: Array<any>,
}
