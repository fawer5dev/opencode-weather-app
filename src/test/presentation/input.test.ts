import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { getCloseCount, setAnswers } from "../helpers/setup";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { ask, closeInput, pickCity } from "../../presentation/input";
import { makeCity, makeMadrid } from "../helpers/fixtures";
import type { ConsoleCapture } from "../helpers/consoleSpy";
import type { CitiesState } from "../../types/AppState";

describe("input", () => {
  describe("ask", () => {
    it("trims the answer", async () => {
      setAnswers("  Ottawa  ");
      expect(await ask("City: ")).toBe("Ottawa");
    });
  });

  describe("pickCity", () => {
    let captured: ConsoleCapture;

    beforeEach(() => {
      captured = captureConsoleLog();
    });

    afterEach(() => {
      captured.restore();
    });

    it("prints the list and returns the chosen city", async () => {
      const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: 7 };
      setAnswers("2");
      const city = await pickCity(state, "Pick: ");
      expect(city).toEqual(makeMadrid());
      const plain = captured.plain();
      expect(plain).toContain("1. Ottawa (Ontario, Canada)");
      expect(plain).toContain("2. Madrid (Madrid, Spain) (default)");
    });

    it("returns null when the choice is out of range", async () => {
      const state: CitiesState = { cities: [makeCity()], defaultCityId: null };
      setAnswers("0");
      expect(await pickCity(state, "Pick: ")).toBe(null);
      expect(captured.plain()).toContain("Invalid option.");
    });

    it("returns null when the choice is not a number", async () => {
      const state: CitiesState = { cities: [makeCity()], defaultCityId: null };
      setAnswers("abc");
      expect(await pickCity(state, "Pick: ")).toBe(null);
      expect(captured.plain()).toContain("Invalid option.");
    });
  });

  describe("closeInput", () => {
    it("closes the readline interface and allows asking again", async () => {
      setAnswers("first");
      expect(await ask("First: ")).toBe("first");
      const before = getCloseCount();
      closeInput();
      expect(getCloseCount()).toBe(before + 1);
      setAnswers("second");
      expect(await ask("Second: ")).toBe("second");
    });
  });
});
