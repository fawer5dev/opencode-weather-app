import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { setAnswers } from "../helpers/setup";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { printMenu, printSettingsMenu, readMenuOption } from "../../presentation/menu";
import type { ConsoleCapture } from "../helpers/consoleSpy";

describe("menu", () => {
  let captured: ConsoleCapture;

  beforeEach(() => {
    captured = captureConsoleLog();
  });

  afterEach(() => {
    captured.restore();
  });

  describe("printMenu", () => {
    it("shows the app name, every option, the city count and the current unit", () => {
      printMenu(3, "c");
      const plain = captured.plain();
      expect(plain).toContain("WEATHER CLI");
      expect(plain).toContain("1. Default city weather");
      expect(plain).toContain("2. Weather of all cities (3)");
      expect(plain).toContain("3. Search and add city");
      expect(plain).toContain("4. Delete city");
      expect(plain).toContain("5. Set default city");
      expect(plain).toContain("6. List saved cities");
      expect(plain).toContain("8. Settings (°C)");
      expect(plain).toContain("9. Exit");
    });

    it("reflects a zero city count and the fahrenheit unit", () => {
      printMenu(0, "f");
      const plain = captured.plain();
      expect(plain).toContain("2. Weather of all cities (0)");
      expect(plain).toContain("8. Settings (°F)");
    });
  });

  describe("printSettingsMenu", () => {
    it("shows the current unit and both unit choices", () => {
      printSettingsMenu("f");
      const plain = captured.plain();
      expect(plain).toContain("Current unit: °F");
      expect(plain).toContain("1. Celsius (°C)");
      expect(plain).toContain("2. Fahrenheit (°F)");
    });
  });

  describe("readMenuOption", () => {
    it("returns a valid menu option", async () => {
      setAnswers("5");
      expect(await readMenuOption()).toBe("5");
    });

    it("returns null for an unknown option", async () => {
      setAnswers("7");
      expect(await readMenuOption()).toBe(null);
    });

    it("returns null for non numeric input", async () => {
      setAnswers("abc");
      expect(await readMenuOption()).toBe(null);
    });
  });
});
