export interface User {
  id: string;
  name: string;
  filename?: string;
  status?: UserStatus;
}

export enum UserStatus {
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  PLAYING = "PLAYING",
}
