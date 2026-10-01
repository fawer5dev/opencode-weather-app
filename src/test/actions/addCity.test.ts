import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { TEST_CITIES_FILE, resetStorage, setAnswers } from "../helpers/setup";
import { installFetchMock, jsonResponse, restoreFetch } from "../helpers/fetchMock";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { forecastPayload, geocodingPayload, geocodingResult, makeCity } from "../helpers/fixtures";
import { addCity } from "../../actions/addCity";
import type { ConsoleCapture } from "../helpers/consoleSpy";
import type { CitiesState } from "../../types/AppState";
import type { GeocodingResult } from "../../api/geocoding";

function emptyState(): CitiesState {
  return { cities: [], defaultCityId: null };
}

function twoOttawas(): GeocodingResult[] {
  return [geocodingResult(), geocodingResult({ id: 2, admin1: "Caracas", country: "Venezuela" })];
}

function geocodeThenForecast(results: GeocodingResult[], temperature: number) {
  return installFetchMock((url) =>
    url.includes("geocoding-api.open-meteo.com")
      ? jsonResponse(geocodingPayload(results))
      : jsonResponse(forecastPayload(temperature)),
  );
}

describe("addCity", () => {
  let captured: ConsoleCapture;

  beforeEach(() => {
    resetStorage();
    captured = captureConsoleLog();
  });

  afterEach(() => {
    captured.restore();
    restoreFetch();
  });

  it("does nothing when the name is empty", async () => {
    setAnswers("");
    const fetchMock = installFetchMock(() => {
      throw new Error("fetch should not be called");
    });
    const state = emptyState();
    await addCity(state, "c");
    expect(captured.plain()).toContain("You did not enter a city name.");
    expect(fetchMock.mock.calls.length).toBe(0);
    expect(state.cities).toEqual([]);
  });

  it("informs when there are no results", async () => {
    setAnswers("Atlantis");
    installFetchMock(() => jsonResponse(geocodingPayload([])));
    const state = emptyState();
    await addCity(state, "c");
    expect(captured.plain()).toContain('No results found for "Atlantis".');
    expect(state.cities).toEqual([]);
    expect(await Bun.file(TEST_CITIES_FILE).exists()).toBe(false);
  });

  it("adds the only result, marks it as default, saves and shows its weather", async () => {
    setAnswers("Ottawa");
    geocodeThenForecast([geocodingResult()], 15.5);
    const state = emptyState();
    await addCity(state, "c");
    expect(state.cities).toEqual([makeCity()]);
    expect(state.defaultCityId).toBe(1);
    const plain = captured.plain();
    expect(plain).toContain("Added Ottawa (Ontario, Canada).");
    expect(plain).toContain("Temperature: 15.5°C");
    expect(await Bun.file(TEST_CITIES_FILE).json()).toEqual(state);
  });

  it("lets the user pick between multiple results", async () => {
    setAnswers("ottawa", "2");
    geocodeThenForecast(twoOttawas(), 25);
    const state = emptyState();
    await addCity(state, "c");
    const plain = captured.plain();
    expect(plain).toContain("1. Ottawa (Ontario, Canada)");
    expect(plain).toContain("2. Ottawa (Caracas, Venezuela)");
    expect(state.cities).toEqual([makeCity({ id: 2, admin1: "Caracas", country: "Venezuela" })]);
    expect(state.defaultCityId).toBe(2);
    expect(plain).toContain("Temperature: 25°C");
  });

  it("cancels when the user picks 0", async () => {
    setAnswers("ottawa", "0");
    geocodeThenForecast(twoOttawas(), 25);
    const state = emptyState();
    await addCity(state, "c");
    expect(captured.plain()).toContain("Cancelled.");
    expect(state.cities).toEqual([]);
    expect(await Bun.file(TEST_CITIES_FILE).exists()).toBe(false);
  });

  it("rejects an invalid selection", async () => {
    setAnswers("ottawa", "9");
    geocodeThenForecast(twoOttawas(), 25);
    const state = emptyState();
    await addCity(state, "c");
    expect(captured.plain()).toContain("Invalid option.");
    expect(state.cities).toEqual([]);
    expect(await Bun.file(TEST_CITIES_FILE).exists()).toBe(false);
  });

  it("does not add a city that is already registered", async () => {
    setAnswers("Ottawa");
    geocodeThenForecast([geocodingResult()], 15.5);
    const state: CitiesState = { cities: [makeCity()], defaultCityId: 1 };
    await addCity(state, "c");
    expect(captured.plain()).toContain("Ottawa is already registered.");
    expect(state.cities).toEqual([makeCity()]);
    expect(captured.plain()).not.toContain("Temperature:");
  });

  it("keeps the previous default city", async () => {
    setAnswers("Madrid");
    geocodeThenForecast(
      [
        geocodingResult({
          id: 7,
          name: "Madrid",
          admin1: "Madrid",
          country: "Spain",
          latitude: 40.4165,
          longitude: -3.70256,
        }),
      ],
      31,
    );
    const state: CitiesState = { cities: [makeCity()], defaultCityId: 1 };
    await addCity(state, "c");
    expect(state.cities.length).toBe(2);
    expect(state.defaultCityId).toBe(1);
    expect(captured.plain()).toContain("Added Madrid (Madrid, Spain).");
  });

  it("shows an error when the geocoding api fails", async () => {
    setAnswers("Ottawa");
    installFetchMock(() => new Response("server error", { status: 500 }));
    await addCity(emptyState(), "c");
    expect(captured.plain()).toContain("[ERROR] Geocoding request failed (HTTP 500)");
  });
});
