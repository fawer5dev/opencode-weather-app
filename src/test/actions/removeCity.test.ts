import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { TEST_CITIES_FILE, resetStorage, setAnswers } from "../helpers/setup";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { makeCity, makeMadrid } from "../helpers/fixtures";
import { removeCity } from "../../actions/removeCity";
import type { ConsoleCapture } from "../helpers/consoleSpy";
import type { CitiesState } from "../../types/AppState";

describe("removeCity", () => {
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
    await removeCity(state);
    expect(captured.plain()).toContain("There are no cities registered yet.");
    expect(state.cities).toEqual([]);
  });

  it("removes the chosen city and saves", async () => {
    setAnswers("2");
    const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: 1 };
    await removeCity(state);
    expect(state.cities).toEqual([makeCity()]);
    expect(captured.plain()).toContain("Deleted Madrid (Madrid, Spain).");
    expect(await Bun.file(TEST_CITIES_FILE).json()).toEqual(state);
  });

  it("reassigns the default when the default city is removed", async () => {
    setAnswers("1");
    const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: 1 };
    await removeCity(state);
    expect(state.defaultCityId).toBe(7);
  });

  it("clears the default when the last city is removed", async () => {
    setAnswers("1");
    const state: CitiesState = { cities: [makeCity()], defaultCityId: 1 };
    await removeCity(state);
    expect(state.cities).toEqual([]);
    expect(state.defaultCityId).toBe(null);
  });

  it("keeps everything when the selection is invalid", async () => {
    setAnswers("abc");
    const state: CitiesState = { cities: [makeCity()], defaultCityId: 1 };
    await removeCity(state);
    expect(captured.plain()).toContain("Invalid option.");
    expect(state.cities).toEqual([makeCity()]);
    expect(state.defaultCityId).toBe(1);
    expect(await Bun.file(TEST_CITIES_FILE).exists()).toBe(false);
  });
});
