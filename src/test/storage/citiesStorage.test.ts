import { beforeEach, describe, expect, it } from "bun:test";
import { TEST_CITIES_FILE, TEST_LEGACY_FILE, resetStorage } from "../helpers/setup";
import { makeCity } from "../helpers/fixtures";
import { loadCities, saveCities } from "../../storage/citiesStorage";

describe("citiesStorage", () => {
  beforeEach(resetStorage);

  it("returns an empty state when no files exist", async () => {
    expect(await loadCities()).toEqual({ cities: [], defaultCityId: null });
  });

  it("saves and loads the state", async () => {
    const state = { cities: [makeCity()], defaultCityId: 1 };
    await saveCities(state);
    expect(await loadCities()).toEqual(state);
    expect(await Bun.file(TEST_CITIES_FILE).json()).toEqual(state);
  });

  it("migrates the legacy file and leaves it untouched", async () => {
    const legacy = { cities: [makeCity()], defaultCityId: 1 };
    await Bun.write(TEST_LEGACY_FILE, JSON.stringify(legacy, null, 2));
    const legacyContent = await Bun.file(TEST_LEGACY_FILE).text();
    expect(await loadCities()).toEqual(legacy);
    expect(await Bun.file(TEST_CITIES_FILE).json()).toEqual(legacy);
    expect(await Bun.file(TEST_LEGACY_FILE).text()).toBe(legacyContent);
  });

  it("prefers the current file over the legacy one", async () => {
    const current = { cities: [makeCity()], defaultCityId: 1 };
    const legacy = { cities: [], defaultCityId: null };
    await saveCities(current);
    await Bun.write(TEST_LEGACY_FILE, JSON.stringify(legacy));
    expect(await loadCities()).toEqual(current);
  });

  it("falls back to the default state on corrupt json", async () => {
    await Bun.write(TEST_CITIES_FILE, "{not valid json");
    expect(await loadCities()).toEqual({ cities: [], defaultCityId: null });
  });

  it("normalizes invalid fields", async () => {
    await Bun.write(TEST_CITIES_FILE, JSON.stringify({ cities: "nope", defaultCityId: "x" }));
    expect(await loadCities()).toEqual({ cities: [], defaultCityId: null });
  });
});
