import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./en.json";

export function initReacti18n(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const options: InitOptions = {
      resources: {
        en: {
          translation: enTranslations,
        },
      },
      lng: "en",
      fallbackLng: "en",

      interpolation: {
        escapeValue: false,
      },
    };

    i18n.use(initReactI18next).init(options, (error) => {
      if (error) reject(error);

      resolve();
    });
  });
}
