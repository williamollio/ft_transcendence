import { RoutePath } from "./router.interface";

export interface Tab {
  label: string;
  path: RoutePath;
}

export interface LocationStateTab {
  idActiveTab: number;
}

export enum idTabs {
  LOGIN = 0,
  PROFILE = 1,
  GAME = 2,
}

export interface TabWithId extends Tab {
  id: number;
}
