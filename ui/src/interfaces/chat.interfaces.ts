import { accessTypes } from "../classes/chatRoom.class";

export interface messagesDto {
  message?: string;
  room?: string;
}

export interface user {
  name: string;
  id: string;
  rank?: "" | "Admin" | "Owner";
}

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