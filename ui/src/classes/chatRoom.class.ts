import { channelUser, messagesDto } from "../interfaces/chat.interfaces";

export type accessTypes = "PUBLIC" | "PRIVATE" | "PROTECTED" | "DIRECTMESSAGE";

export class chatRoom {
  id?: string;
  key: string;
  access: accessTypes;
  messages: Array<messagesDto>;
  users: Array<channelUser>;

  constructor(id?: string, key?: string, access?: accessTypes) {
    id ? this.id = id : undefined;
	key ? this.key = key : this.key = "";
    access ? (this.access = access) : (this.access = "PUBLIC");
    this.messages = new Array<messagesDto>();
    this.users = new Array<channelUser>();
  }
}
