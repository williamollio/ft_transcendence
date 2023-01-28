import { FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";

export enum ErrorType {
  REQUIRED = "required",
}

export function useReactHookFormHelper() {
  const { t } = useTranslation();

  function getErrorMessage(error: FieldError): string {
    if (error.type === ErrorType.REQUIRED) {
      return t(translationKeys.errorMessages.required);
    } else {
      return t(translationKeys.errorMessages.default);
    }
  }

  return { getErrorMessage };
}
