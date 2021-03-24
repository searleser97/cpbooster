import type { LangAliases } from "./LangAliases";

export type LangConfig = {
  template: string;
  command: string;
  debugCommand: string;
  aliases?: LangAliases;
};
