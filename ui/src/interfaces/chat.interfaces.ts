import { accessTypes } from "../classes/chatRoom.class";

export interface messagesDto {
  user?: string;
  message?: string;
  room?: string;
}

export interface user {
  id: string;
  name: string;
  rank?: "" | "Admin" | "Owner";
}

export interface CRDialogValue {
  key: string;
  access: accessTypes;
  password: string;
}
