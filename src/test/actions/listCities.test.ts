import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { makeCity, makeMadrid } from "../helpers/fixtures";
import { listCities } from "../../actions/listCities";
import type { ConsoleCapture } from "../helpers/consoleSpy";
import type { CitiesState } from "../../types/AppState";

describe("listCities", () => {
  let captured: ConsoleCapture;

  beforeEach(() => {
    captured = captureConsoleLog();
  });

  afterEach(() => {
    captured.restore();
  });

  it("informs when there are no cities", async () => {
    const state: CitiesState = { cities: [], defaultCityId: null };
    await listCities(state);
    expect(captured.plain()).toContain("There are no cities registered yet. Add one with option 3.");
  });

  it("lists the saved cities marking the default one", async () => {
    const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: 7 };
    await listCities(state);
    const plain = captured.plain();
    expect(plain).toContain("1. Ottawa (Ontario, Canada)");
    expect(plain).toContain("2. Madrid (Madrid, Spain) (default)");
  });
});
