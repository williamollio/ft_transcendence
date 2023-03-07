import { RoutePath } from "./router.interface";

export enum idTabs {
  PROFILE = 0,
  GAME = 1,
  LOGIN = 2,
  CHAT = 3,
  STATS = 4,
}

export interface TabWithId extends NavTab {
  id: number;
}

export interface NavTab {
  label: string;
  link: RoutePath;
}

export const tabs: NavTab[] = [
  {
    label: "profile",
    link: RoutePath.PROFILE,
  },
  {
    label: "game",
    link: RoutePath.GAME,
  },
  {
    label: "chat",
    link: RoutePath.CHAT,
  },
  {
    label: "stats",
    link: RoutePath.STATS,
  },
];
