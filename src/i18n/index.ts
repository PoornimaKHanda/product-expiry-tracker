import { en } from "./en";

export const messages = {
    en,
};

export type SupportedLocales = keyof typeof messages;

export const locale: SupportedLocales = "en";

export const strings = messages[locale];
