import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { TEST_CITIES_FILE, resetStorage, setAnswers } from "../helpers/setup";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { makeCity, makeMadrid } from "../helpers/fixtures";
import { setDefaultCity } from "../../actions/setDefaultCity";
import type { ConsoleCapture } from "../helpers/consoleSpy";
import type { CitiesState } from "../../types/AppState";

describe("setDefaultCity", () => {
  let captured: ConsoleCapture;

  beforeEach(() => {
    resetStorage();
    captured = captureConsoleLog();
  });

  afterEach(() => {
    captured.restore();
  });

  it("informs when there are no cities", async () => {
    const state: CitiesState = { cities: [], defaultCityId: null };
    await setDefaultCity(state);
    expect(captured.plain()).toContain("There are no cities registered yet. Add one with option 3.");
    expect(state.defaultCityId).toBe(null);
  });

  it("sets and saves the chosen default city", async () => {
    setAnswers("2");
    const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: 1 };
    await setDefaultCity(state);
    expect(state.defaultCityId).toBe(7);
    expect(captured.plain()).toContain("Default city set to Madrid (Madrid, Spain).");
    expect(await Bun.file(TEST_CITIES_FILE).json()).toEqual(state);
  });

  it("keeps the current default when the selection is invalid", async () => {
    setAnswers("99");
    const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: 1 };
    await setDefaultCity(state);
    expect(captured.plain()).toContain("Invalid option.");
    expect(state.defaultCityId).toBe(1);
    expect(await Bun.file(TEST_CITIES_FILE).exists()).toBe(false);
  });
});
