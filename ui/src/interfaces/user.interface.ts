export interface User {
  id: string;
  name: string;
  filename?: string;
  status?: UserStatus;
  secondFactorEnabled: boolean;
  secondFactorLogged: boolean;
}

export enum UserStatus {
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  PLAYING = "PLAYING",
}
