import { RoutePath } from "./router.interface";

export interface NavTab {
  label: string;
  path: RoutePath;
}

export interface LocationStateTab {
  idActiveTab: number;
}

export enum idTabs {
  PROFILE = 0,
  GAME = 1,
  LOGIN = 2,
}

export interface TabWithId extends NavTab {
  id: number;
}
