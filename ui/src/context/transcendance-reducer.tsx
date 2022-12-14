import { ToastType } from "./toast";

export interface transcendanceState {
  toast?: {
    type?: ToastType;
    title?: string;
    message?: string;
  };
}

export const initialTranscendanceState: transcendanceState = {
  toast: undefined,
};

export type TranscendanceStateAction = {
  type: TranscendanceStateActionType;
  toast?: {
    type?: ToastType;
    title?: string;
    message?: string;
  };
};

export enum TranscendanceStateActionType {
  TOGGLE_TOAST = "TOGGLE_TOAST",
}

export const transcendanceReducer = (
  state: transcendanceState,
  action: TranscendanceStateAction
): transcendanceState => {
  switch (action.type) {
    case TranscendanceStateActionType.TOGGLE_TOAST:
      return {
        ...state,
        toast: action.toast,
      };
    default:
      throw new Error(
        `TranscendanceStateActionType '${action}' is not defined`
      );
  }
};
