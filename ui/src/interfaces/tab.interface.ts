import { RoutePath } from "./router.interface";

export enum idTabs {
  PROFILE = 0,
  GAME = 1,
  LOGIN = 2,
  STATS = 3,
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
    label: "stats",
    link: RoutePath.STATS,
  },
];
