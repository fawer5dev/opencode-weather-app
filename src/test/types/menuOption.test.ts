import { describe, expect, it } from "bun:test";
import { isMenuOption } from "../../types/MenuOption";

const VALID_OPTIONS = ["1", "2", "3", "4", "5", "6", "8", "9"];
const INVALID_OPTIONS = ["7", "0", "10", "abc", "", " 1", "1 "];

describe("isMenuOption", () => {
  for (const option of VALID_OPTIONS) {
    it(`accepts "${option}"`, () => {
      expect(isMenuOption(option)).toBe(true);
    });
  }

  for (const option of INVALID_OPTIONS) {
    it(`rejects "${option}"`, () => {
      expect(isMenuOption(option)).toBe(false);
    });
  }
});
