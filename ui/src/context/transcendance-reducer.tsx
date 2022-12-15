import { ToastType } from "./toast";

export interface TranscendanceState {
  toast?: {
    type?: ToastType;
    title?: string;
    message?: string;
  };
}

export const initialTranscendanceState: TranscendanceState = {
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
  state: TranscendanceState,
  action: TranscendanceStateAction
): TranscendanceState => {
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
