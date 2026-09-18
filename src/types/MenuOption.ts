export type MenuOption = "1" | "2" | "3" | "4" | "5" | "6" | "8" | "9";

const MENU_OPTIONS: ReadonlySet<string> = new Set([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "9",
]);

export function isMenuOption(value: string): value is MenuOption {
  return MENU_OPTIONS.has(value);
}
