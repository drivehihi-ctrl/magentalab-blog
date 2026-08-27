import { ko } from "./ko";
import { en } from "./en";
import { ja } from "./ja";

const dictionaries = {
  ko,
  en,
  ja,
};

export type Language = "ko" | "en" | "ja";

export function getToxicityDict(lang: string = "ko") {
  return dictionaries[lang as Language] || dictionaries.ko;
}
