import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { installFetchMock, jsonResponse, restoreFetch } from "../helpers/fetchMock";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { forecastPayload, makeCity, makeMadrid } from "../helpers/fixtures";
import {
  getAllCitiesWeather,
  getDefaultCityWeather,
  showWeather,
} from "../../actions/getWeather";
import type { ConsoleCapture } from "../helpers/consoleSpy";
import type { CitiesState } from "../../types/AppState";

describe("getWeather actions", () => {
  let captured: ConsoleCapture;

  beforeEach(() => {
    captured = captureConsoleLog();
  });

  afterEach(() => {
    captured.restore();
    restoreFetch();
  });

  describe("showWeather", () => {
    it("prints the weather of the city", async () => {
      const fetchMock = installFetchMock(() => jsonResponse(forecastPayload(18.5)));
      await showWeather(makeCity(), "c");
      const plain = captured.plain();
      expect(plain).toContain("Weather in Ottawa (Ontario, Canada)");
      expect(plain).toContain("Temperature: 18.5°C");
      const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
      expect(url.searchParams.get("latitude")).toBe("45.41117");
      expect(url.searchParams.get("longitude")).toBe("-75.69812");
    });

    it("prints an error when the forecast api fails", async () => {
      installFetchMock(() => new Response("boom", { status: 502 }));
      await showWeather(makeCity(), "c");
      expect(captured.plain()).toContain("[ERROR] Forecast request failed (HTTP 502)");
    });
  });

  describe("getDefaultCityWeather", () => {
    it("informs when there is no default city", async () => {
      const state: CitiesState = { cities: [makeCity()], defaultCityId: null };
      await getDefaultCityWeather(state, "c");
      expect(captured.plain()).toContain("There is no default city yet.");
    });

    it("informs when the default city is not registered", async () => {
      const state: CitiesState = { cities: [makeCity()], defaultCityId: 99 };
      await getDefaultCityWeather(state, "c");
      expect(captured.plain()).toContain("The default city is not registered anymore.");
    });

    it("shows the weather of the default city", async () => {
      installFetchMock(() => jsonResponse(forecastPayload(30)));
      const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: 7 };
      await getDefaultCityWeather(state, "c");
      const plain = captured.plain();
      expect(plain).toContain("Weather in Madrid (Madrid, Spain)");
      expect(plain).toContain("Temperature: 30°C");
    });
  });

  describe("getAllCitiesWeather", () => {
    it("informs when there are no cities", async () => {
      const state: CitiesState = { cities: [], defaultCityId: null };
      await getAllCitiesWeather(state, "c");
      expect(captured.plain()).toContain("There are no cities registered yet. Add one with option 3.");
    });

    it("shows the weather of every city", async () => {
      installFetchMock((url) =>
        jsonResponse(forecastPayload(url.includes("latitude=45.41117") ? 10 : 20)),
      );
      const state: CitiesState = { cities: [makeCity(), makeMadrid()], defaultCityId: null };
      await getAllCitiesWeather(state, "c");
      const plain = captured.plain();
      expect(plain).toContain("Weather in Ottawa (Ontario, Canada)");
      expect(plain).toContain("Temperature: 10°C");
      expect(plain).toContain("Weather in Madrid (Madrid, Spain)");
      expect(plain).toContain("Temperature: 20°C");
    });
  });
});
