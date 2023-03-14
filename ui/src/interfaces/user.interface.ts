export interface UserIds {
  id: string;
  name?: string;
  filename?: string;
  status?: UserStatus;
}
export interface User {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  filename?: string;
}

export enum UserStatus {
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  PLAYING = "PLAYING",
}
