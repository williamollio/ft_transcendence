export interface messagesDto {
  user?: string;
  message?: string;
  room?: string;
}

export interface chatRoom {
  key: string;
  access: "public" | "private" | "password";
  password?: string;
  messages: messagesDto[];
  users?: Map<string, string>;
}
